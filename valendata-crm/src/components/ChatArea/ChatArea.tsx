// src/components/ChatArea.tsx
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';

import './ChatArea.css';

interface Message {
  text: string;
  time: string;
  type: 'customer' | 'agent';
}

interface Conversations {
  [phoneNumber: string]: Message[];
}

interface ChatAreaProps {
  conversations: Conversations;
  currentCustomer: string | null;
  onSendMessage: (text: string) => void;
}

function ChatArea({ conversations, currentCustomer, onSendMessage }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentCustomer]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (): void => {
    const text = inputValue.trim();
    if (text) {
      onSendMessage(text);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-area">
      <ChatHeader currentCustomer={currentCustomer} />
      
      <MessageList 
        currentCustomer={currentCustomer}
        messages={currentCustomer ? conversations[currentCustomer] : []}
        messagesEndRef={messagesEndRef}
      />
      
      <MessageInput 
        value={inputValue}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        disabled={!currentCustomer}
      />
    </div>
  );
}

export default ChatArea;