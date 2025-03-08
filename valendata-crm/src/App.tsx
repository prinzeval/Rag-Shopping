// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';

interface Message {
  text: string;
  time: string;
  type: 'customer' | 'agent';
}

interface Conversations {
  [phoneNumber: string]: Message[];
}

interface UnreadMessages {
  [phoneNumber: string]: number;
}

function App() {
  const [conversations, setConversations] = useState<Conversations>({});
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessages>({});
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial conversations
    fetch("/api/get-conversations")
      .then(response => response.json())
      .then(data => {
        setConversations(data.conversations);
      })
      .catch(error => console.error("Error fetching conversations:", error));

    // Initialize WebSocket connection
    connectWebSocket();

    return () => {
      // Clean up WebSocket on component unmount
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const connectWebSocket = (): void => {
    // Use the backend URL explicitly
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:8000/ws`; // Explicitly use port 8000
    
    // Update connection status
    setConnectionStatus('connecting');
    
    // Create WebSocket
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);
    
    // WebSocket event handlers
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus('connected');
      
      // Hide status indicator after 3 seconds
      setTimeout(() => {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
          statusElement.style.opacity = '0';
        }
      }, 3000);
    };
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      
      if (data.type === 'initial_data' || data.type === 'new_message') {
        setConversations(data.conversations);
        
        // Handle unread messages
        if (data.type === 'new_message' && data.sender !== currentCustomer) {
          setUnreadMessages(prev => ({
            ...prev,
            [data.sender]: (prev[data.sender] || 0) + 1
          }));
        }
      }
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      setConnectionStatus('disconnected');
      
      // Try to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
  };

  const handleSendMessage = async (text: string): Promise<void> => {
    if (text && currentCustomer) {
      try {
        await fetch("/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: currentCustomer, text })
        });
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const handleSwitchCustomer = (phoneNumber: string): void => {
    setCurrentCustomer(phoneNumber);
    
    // Clear unread messages for this customer
    setUnreadMessages(prev => ({
      ...prev,
      [phoneNumber]: 0
    }));
  };

  return (
    <div className="app">
      <div className="chat-interface">
        <Sidebar 
          conversations={conversations} 
          currentCustomer={currentCustomer}
          unreadMessages={unreadMessages}
          onSwitchCustomer={handleSwitchCustomer}
        />
        <ChatArea 
          conversations={conversations}
          currentCustomer={currentCustomer}
          onSendMessage={handleSendMessage}
        />
      </div>
      <ConnectionStatus status={connectionStatus} />
    </div>
  );
}

export default App;
