// src/components/Sidebar.tsx
import React, { useState } from 'react';
import ConversationItem from '../ConversationItem/ConversationItem';
import './Sidebar.css';

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

interface SidebarProps {
  conversations: Conversations;
  currentCustomer: string | null;
  unreadMessages: UnreadMessages;
  onSwitchCustomer: (phoneNumber: string) => void;
}

function Sidebar({ conversations, currentCustomer, unreadMessages, onSwitchCustomer }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Filter conversations based on search query
  const filteredConversations = Object.entries(conversations).filter(([phoneNumber]) => 
    phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="user-profile">
        <div className="avatar-container">
          <i className="fas fa-user"></i>
        </div>
      </div>
      
      <div className="search-container">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <button className="filter-button">
          <i className="fas fa-filter"></i>
        </button>
      </div>
      
      <div className="conversation-list">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(([phoneNumber, messages]) => (
            <ConversationItem 
              key={phoneNumber}
              phoneNumber={phoneNumber}
              messages={messages}
              isActive={phoneNumber === currentCustomer}
              unreadCount={unreadMessages[phoneNumber] || 0}
              onClick={() => onSwitchCustomer(phoneNumber)}
            />
          ))
        ) : (
          <div id="no-chats">No active chats</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;