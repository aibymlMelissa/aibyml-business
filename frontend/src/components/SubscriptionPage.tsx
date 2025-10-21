
import React from 'react';
import type { User } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface SubscriptionPageProps {
  user: User;
  onSignOut: () => void;
}

const providerDetails = {
  Google: { icon: <GoogleIcon />, color: "text-blue-600" },
  GitHub: { icon: <GitHubIcon />, color: "text-gray-800" },
  WhatsApp: { icon: <WhatsAppIcon />, color: "text-green-500" },
};

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, onSignOut }) => {
  const details = providerDetails[user.provider];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="mb-6">
          <span className="inline-block p-4 bg-indigo-100 rounded-full">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Authentication Successful!</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome, <span className="font-semibold">{user.name}</span>!
        </p>

        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">Your Subscription Details</h2>
          <p className="text-gray-500 mt-2">You are subscribed to our Premium Plan.</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Authenticated via</span>
            <span className={details.color}>{details.icon}</span>
            <span className="font-medium">{user.provider}</span>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="mt-10 w-full max-w-xs mx-auto bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPage;
