// LeftPanel.tsx
import React from 'react';
import { Conversations } from './types';

interface LeftPanelProps {
  conversations: Conversations;
  currentCustomer: string | null;
  setCurrentCustomer: (phoneNumber: string | null) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  conversations,
  currentCustomer,
  setCurrentCustomer
}) => {
  return (
    <div className="left-panel">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search customers..." 
          onChange={(e) => console.log(e.target.value)} // Add search logic later
        />
      </div>
      <div className="customer-list">
        {Object.keys(conversations).map((phoneNumber) => (
          <div
            key={phoneNumber}
            className={`customer-item ${currentCustomer === phoneNumber ? 'active' : ''}`}
            onClick={() => setCurrentCustomer(phoneNumber)}
          >
            <div className="avatar">
              {phoneNumber.substring(0, 2)}
            </div>
            <div className="customer-info">
              <h4>Customer {phoneNumber.substring(0, 6)}...</h4>
              <p>
                {conversations[phoneNumber][conversations[phoneNumber].length - 1]?.text || 'New conversation'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;