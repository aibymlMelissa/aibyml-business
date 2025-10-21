import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import Subscription from './components/Subscription';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'subscription'>('landing');

  return (
    <div className="App">
      {currentView === 'landing' ? (
        <Landing onNavigateToSubscription={() => setCurrentView('subscription')} />
      ) : (
        <Subscription onBack={() => setCurrentView('landing')} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
