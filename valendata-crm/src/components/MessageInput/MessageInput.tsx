// src/components/MessageInput.tsx
import React from 'react';
import './MessageInput.css';


interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

function MessageInput({ value, onChange, onSend, onKeyPress, disabled }: MessageInputProps) {
  return (
    <div className="message-input-container">
      <button className="input-action-button">
        <i className="far fa-smile"></i>
      </button>
      <button className="input-action-button">
        <i className="fas fa-plus"></i>
      </button>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={disabled}
        />
      </div>
      <button 
        className="input-action-button send-button"
        onClick={onSend}
        disabled={disabled}
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default MessageInput;