// src/components/MessageList.tsx
import React from 'react';
import Message from '../Message/Message';
import './MessageList.css';

interface MessageData {
  text: string;
  time: string;
  type: 'customer' | 'agent';
}

interface MessageListProps {
  currentCustomer: string | null;
  messages: MessageData[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

function MessageList({ currentCustomer, messages, messagesEndRef }: MessageListProps) {
  // If no customer is selected or no messages
  if (!currentCustomer) {
    return (
      <div className="messages-container">
        <div className="no-chat-selected">
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  // Group messages by date (simplified for now)
  const groupedMessages: { [date: string]: MessageData[] } = {
    Today: messages || []
  };

  return (
    <div className="messages-container">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <React.Fragment key={date}>
          {dateMessages.length > 0 && (
            <>
              <div className="date-separator">{date}</div>
              {dateMessages.map((message, index) => (
                <Message key={index} message={message} />
              ))}
            </>
          )}
          {dateMessages.length === 0 && (
            <div className="no-messages">No messages yet</div>
          )}
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;