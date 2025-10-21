import React, { useState } from 'react';
import AuthPage from './AuthPage';
import SubscriptionPage from './SubscriptionPage';
import type { User } from '../types';
import { AuthProvider } from '../types';

interface SubscriptionProps {
  onBack: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuth = (provider: AuthProvider) => {
    // In a real application, this would involve a call to an authentication service
    const mockUser: User = {
      name: `User-${Math.floor(Math.random() * 1000)}`,
      provider: provider,
    };
    console.log(`Simulating authentication with ${provider}...`);
    setUser(mockUser);
  };

  const handleSignOut = () => {
    console.log('Signing out user...');
    setUser(null);
    onBack();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {user ? (
        <SubscriptionPage user={user} onSignOut={handleSignOut} />
      ) : (
        <AuthPage onAuth={handleAuth} />
      )}
    </div>
  );
};

export default Subscription;
