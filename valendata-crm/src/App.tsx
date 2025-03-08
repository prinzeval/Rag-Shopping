// App.tsx
import { useEffect, useState } from 'react';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import { Conversations } from './components/types';
import './App.css';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversations>({});
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial_data' || data.type === 'new_message') {
        setConversations(data.conversations);
      }
    };

    // Fetch initial conversations
    fetch('http://localhost:8000/api/get-conversations')
      .then((res) => res.json())
      .then((data: { conversations: Conversations }) => 
        setConversations(data.conversations)
      );

    return () => ws.close();
  }, []);

  const sendMessage = async (text: string) => {
    if (!currentCustomer) return;
    
    await fetch('http://localhost:8000/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        to: currentCustomer, 
        text 
      }),
    });
  };

  return (
    <div className="app-container">
      <LeftPanel
        conversations={conversations}
        currentCustomer={currentCustomer}
        setCurrentCustomer={setCurrentCustomer}
      />
      <RightPanel
        currentCustomer={currentCustomer}
        conversations={conversations}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default App;