// src/components/ConnectionStatus.tsx
import React, { useEffect, useState } from 'react';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected';
}

function ConnectionStatus({ status }: ConnectionStatusProps) {
  const [visible, setVisible] = useState<boolean>(true);

  // Hide status after connection
  useEffect(() => {
    if (status === 'connected') {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [status]);

  // Map status to display text
  const statusText: { [key: string]: string } = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected. Reconnecting...'
  };

  if (!visible) return null;

  return (
    <div id="connection-status" className={`connection-status ${status}`}>
      {statusText[status]}
    </div>
  );
}

export default ConnectionStatus;