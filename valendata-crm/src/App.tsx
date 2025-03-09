// App.tsx
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';
import Catalog from './components/Catalog/Catalog';
import { Conversations } from './components/types';
import './App.css';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversations>({});
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>('chat');

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial_data' || data.type === 'new_message') {
        setConversations(data.conversations);
      }
    };

    // Fetch initial conversations
    fetch('http://localhost:8000/api/get-conversations')
      .then((res) => res.json())
      .then((data: { conversations: Conversations }) => 
        setConversations(data.conversations)
      );

    return () => ws.close();
  }, []);

  const sendMessage = async (text: string) => {
    if (!currentCustomer) return;
    
    await fetch('http://localhost:8000/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        to: currentCustomer, 
        text 
      }),
    });
  };

  const renderContent = () => {
    switch (activePage) {
      case 'chat':
        return (
          <>
            <LeftPanel
              conversations={conversations}
              currentCustomer={currentCustomer}
              setCurrentCustomer={setCurrentCustomer}
            />
            <RightPanel
              currentCustomer={currentCustomer}
              conversations={conversations}
              sendMessage={sendMessage}
            />
          </>
        );
      case 'catalog':
        return <Catalog />;
      case 'dashboard':
        return <div className="placeholder-page">Dashboard (Coming soon)</div>;
      case 'orders':
        return <div className="placeholder-page">Orders (Coming soon)</div>;
      case 'customers':
        return <div className="placeholder-page">Customers (Coming soon)</div>;
      case 'analytics':
        return <div className="placeholder-page">Analytics (Coming soon)</div>;
      case 'settings':
        return <div className="placeholder-page">Settings (Coming soon)</div>;
      default:
        return <div className="placeholder-page">Page not found</div>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;