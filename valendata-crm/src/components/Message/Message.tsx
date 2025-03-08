// src/components/Message.tsx
import React from 'react';
import './Message.css';


interface MessageData {
  text: string;
  time: string;
  type: 'customer' | 'agent';
}

interface MessageProps {
  message: MessageData;
}

function Message({ message }: MessageProps) {
  return (
    <div className={`message ${message.type === 'customer' ? 'received' : 'sent'}`}>
      <div className="message-bubble">
        {message.text}
      </div>
      <div className="message-info">
        <span className="message-time">{message.time}</span>
        {message.type === 'agent' && (
          <span className="message-status">
            <i className="fas fa-check"></i>
          </span>
        )}
      </div>
    </div>
  );
}

export default Message;