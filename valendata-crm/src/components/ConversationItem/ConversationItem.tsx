// src/components/ConversationItem.tsx
import React from 'react';

import './ConversationItem.css';

interface Message {
  text: string;
  time: string;
  type: 'customer' | 'agent';
}

interface ConversationItemProps {
  phoneNumber: string;
  messages: Message[];
  isActive: boolean;
  unreadCount: number;
  onClick: () => void;
}

function ConversationItem({ phoneNumber, messages, isActive, unreadCount, onClick }: ConversationItemProps) {
  // Get last message for preview
  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const preview = lastMessage?.text || "New conversation";
  const time = lastMessage?.time || "";
  
  // Determine if this is a group or private chat
  const chatType = phoneNumber.startsWith("group_") ? "Group Chat" : "Private Chat";
  const displayName = phoneNumber.startsWith("group_") ? 
                      phoneNumber.replace("group_", "Group ") : 
                      phoneNumber.substring(0, 6) + "...";

  return (
    <div 
      className={`conversation-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        <div className="avatar-circle">{displayName[0]}</div>
        <span className="status-dot"></span>
      </div>
      <div className="conversation-info">
        <div className="conversation-name">{chatType}</div>
        <div className="conversation-preview">
          {preview.length > 20 ? preview.substring(0, 20) + '...' : preview}
        </div>
      </div>
      <div className="conversation-meta">
        <div className="conversation-time">{time}</div>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>
    </div>
  );
}

export default ConversationItem;