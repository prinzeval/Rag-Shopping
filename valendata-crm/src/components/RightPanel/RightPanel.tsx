// RightPanel.tsx
import React, { useState } from 'react';
import { Conversations, Message } from '../types';
import './rightpanel.css';

interface RightPanelProps {
  currentCustomer: string | null;
  conversations: Conversations;
  sendMessage: (text: string) => Promise<void>;
}

const RightPanel: React.FC<RightPanelProps> = ({
  currentCustomer,
  conversations,
  sendMessage
}) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentCustomer) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="right-panel">
      {currentCustomer ? (
        <>
          <div className="chat-header">
            <h3>{currentCustomer}</h3>
          </div>
          <div className="message-container">
            {conversations[currentCustomer].map((msg: Message, index: number) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="bubble">{msg.text}</div>
                <div className="time">{msg.time}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewMessage(e.target.value)
              }
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <div className="select-customer">
          Select a customer to start chatting
        </div>
      )}
    </div>
  );
};

export default RightPanel;