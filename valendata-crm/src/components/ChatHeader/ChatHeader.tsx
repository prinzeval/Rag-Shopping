// src/components/ChatHeader.tsx
import React from 'react';
import './ChatHeader.css';


interface ChatHeaderProps {
  currentCustomer: string | null;
}

function ChatHeader({ currentCustomer }: ChatHeaderProps) {
  // Display placeholder if no customer selected
  const displayName = currentCustomer || "Chat Bubble";
  
  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-avatar">
          <img src="/api/placeholder/40/40" alt="Profile" />
        </div>
        <div className="chat-details">
          <div className="chat-name">{displayName}</div>
          <div className="chat-status">See members</div>
        </div>
      </div>
      <div className="chat-actions">
        <button className="action-button">
          <i className="fas fa-video"></i>
        </button>
        <button className="action-button close-button">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;