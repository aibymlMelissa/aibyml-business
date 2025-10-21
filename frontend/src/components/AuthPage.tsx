import React, { useState, useRef, useEffect } from 'react';
import { AuthProvider } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

interface AuthPageProps {
  onAuth: (provider: AuthProvider) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [view, setView] = useState<'auth' | 'signUpDetails' | 'verify'>('auth');
  const [emailForVerification, setEmailForVerification] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  
  // State for password reset modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // State for puzzle verification modal
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);

  // State for Terms and Privacy modals
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleOpenResetModal = () => {
    setResetEmail('');
    setResetSent(false);
    setShowResetModal(true);
  };
  
  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  const handleResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Simulating password reset for email: ${resetEmail}`);
    setResetSent(true);
  };
  
  const handleEmailSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setView('signUpDetails');
  };

  const handleAttemptCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Show the puzzle verification before proceeding
    setShowPuzzleModal(true);
  };

  const handlePuzzleSuccess = () => {
    setShowPuzzleModal(false);
    console.log(`Simulating account creation for: ${emailForVerification} with name: ${fullName}`);
    console.log(`Simulating sending verification email to: ${emailForVerification}`);
    setView('verify');
  };

  const handleBackToAuth = () => {
    setFullName('');
    setPassword('');
    setView('auth');
  };

  const handleBackToSignIn = () => {
    setEmailForVerification('');
    setFullName('');
    setPassword('');
    setView('auth');
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to 30-day Free Subscription</h1>
          <p className="text-gray-500 mt-2">
            {view === 'auth' && 'Sign in or create an account to get started.'}
            {view === 'signUpDetails' && 'Just a few more details to get you set up.'}
            {view === 'verify' && 'Almost there!'}
          </p>
        </div>
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          {view === 'auth' && (
            <div className="animate-fade-in">
              <form onSubmit={handleEmailSignUp}>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="signup-email"
                    id="signup-email"
                    value={emailForVerification}
                    onChange={(e) => setEmailForVerification(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                    aria-label="Email address for sign up"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!acceptedTerms}
                >
                  Continue with Email
                </button>
              </form>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div className="space-y-4">
                <AuthButton
                  provider={AuthProvider.Google}
                  onClick={() => onAuth(AuthProvider.Google)}
                  icon={<GoogleIcon />}
                  text="Continue with Google"
                  className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  disabled={!acceptedTerms}
                />
                <AuthButton
                  provider={AuthProvider.GitHub}
                  onClick={() => onAuth(AuthProvider.GitHub)}
                  icon={<GitHubIcon />}
                  text="Continue with GitHub"
                  className="bg-[#24292e] text-white hover:bg-[#333]"
                  disabled={!acceptedTerms}
                />
                <AuthButton
                  provider={AuthProvider.WhatsApp}
                  onClick={() => onAuth(AuthProvider.WhatsApp)}
                  icon={<WhatsAppIcon />}
                  text="Continue with WhatsApp"
                  className="bg-[#25D366] text-white hover:bg-[#1DAE52]"
                  disabled={!acceptedTerms}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                      aria-describedby="terms-description"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600 cursor-pointer">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTerms(true);
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPrivacy(true);
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                  <button 
                      onClick={handleOpenResetModal} 
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
                  >
                      Forgot password?
                  </button>
              </div>
            </div>
          )}
          {view === 'signUpDetails' && (
            <div className="animate-fade-in">
                <button onClick={handleBackToAuth} className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none inline-flex items-center transition-colors mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Create your account</h2>
                    <p className="mt-2 text-gray-600 text-sm">
                        for <span className="font-semibold text-gray-800">{emailForVerification}</span>
                    </p>
                </div>
                <form onSubmit={handleAttemptCreateAccount} className="space-y-4">
                    <div>
                        <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 sr-only">
                            Full Name
                        </label>
                        <input
                            id="full-name"
                            name="full-name"
                            type="text"
                            autoComplete="name"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password (8+ characters)"
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
          )}
          {view === 'verify' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800">Check your email</h2>
              <p className="mt-3 text-gray-600">
                We've sent a verification link to <br/>
                <span className="font-semibold text-gray-800">{emailForVerification}</span>.
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                  Click the link in the email to activate your account.
              </p>
              <div className="mt-8">
                  <button 
                      onClick={handleBackToSignIn} 
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
                  >
                      &larr; Back to Sign In
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" 
          aria-modal="true" 
          role="dialog"
          onClick={handleCloseResetModal}
        >
          <div 
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm relative transform animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleCloseResetModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {resetSent ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">Check your inbox</h2>
                <p className="mt-2 text-gray-600">
                  If an account with the email <span className="font-semibold text-gray-800">{resetEmail}</span> exists, you will receive a password reset link.
                </p>
                <button
                  onClick={handleCloseResetModal}
                  className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Reset Password</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">We'll send a password reset link to your email.</p>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="reset-email"
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                    aria-label="Email address for password reset"
                  />
                </div>
                <div className="mt-6 flex flex-col-reverse sm:flex-row-reverse gap-3">
                   <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseResetModal}
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Cancel
                    </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <PuzzleVerificationModal
        isOpen={showPuzzleModal}
        onClose={() => setShowPuzzleModal(false)}
        onSuccess={handlePuzzleSuccess}
      />

      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </>
  );
};

interface AuthButtonProps {
    provider: AuthProvider;
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    className: string;
    disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onClick, icon, text, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm md:text-base ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <span className="mr-3">{icon}</span>
            {text}
        </button>
    );
};


interface PuzzleVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PuzzleVerificationModal: React.FC<PuzzleVerificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [piecePosition, setPiecePosition] = useState({ x: 20, y: 80 });
  const [isVerified, setIsVerified] = useState(false);

  const pieceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const targetPosition = { x: 200, y: 80 };
  const tolerance = 10;

  useEffect(() => {
    if (isOpen) {
      // Reset piece position when modal opens
      setPiecePosition({ x: 20, y: 80 });
      setIsVerified(false);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isVerified) return;
    setIsDragging(true);

    const piece = pieceRef.current;
    if (!piece) return;

    const event = 'touches' in e ? e.touches[0] : e;
    const rect = piece.getBoundingClientRect();
    offsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    piece.style.cursor = 'grabbing';
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isVerified) return;

    const container = containerRef.current;
    if (!container) return;
    
    const event = 'touches' in e ? e.touches[0] : e;
    const containerRect = container.getBoundingClientRect();

    let newX = event.clientX - containerRect.left - offsetRef.current.x;
    let newY = event.clientY - containerRect.top - offsetRef.current.y;
    
    // Constrain piece within the container
    newX = Math.max(0, Math.min(newX, containerRect.width - pieceRef.current!.offsetWidth));
    newY = Math.max(0, Math.min(newY, containerRect.height - pieceRef.current!.offsetHeight));

    setPiecePosition({ x: newX, y: newY });
  };
  
  const handleMouseUp = () => {
    if (!isDragging || isVerified) return;
    setIsDragging(false);

    if (pieceRef.current) {
      pieceRef.current.style.cursor = 'grab';
    }
    document.body.style.cursor = '';

    const dx = Math.abs(piecePosition.x - targetPosition.x);
    const dy = Math.abs(piecePosition.y - targetPosition.y);

    if (dx <= tolerance && dy <= tolerance) {
      setPiecePosition(targetPosition);
      setIsVerified(true);
      setTimeout(() => {
        onSuccess();
      }, 500); // Wait for the success animation
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
      onMouseMove={handleMouseMove as any}
      onMouseUp={handleMouseUp}
      onTouchMove={handleMouseMove as any}
      onTouchEnd={handleMouseUp}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative transform animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Please verify you're human</h2>
        <p className="text-center text-gray-500 mb-4 text-sm">Slide the puzzle piece to the correct spot.</p>
        
        <div 
          ref={containerRef}
          className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden select-none"
        >
          {/* Background Image/Pattern */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
            <defs>
              <linearGradient id="puzzle-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                  </feMerge>
              </filter>
            </defs>
            <rect width="300" height="150" fill="url(#puzzle-bg)" />
             <text x="50%" y="40%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fill="white" opacity="0.3" fontFamily="sans-serif" fontWeight="bold">GEMINI</text>
          </svg>
          
          {/* Target Slot */}
          <div 
            className="absolute w-12 h-12 bg-black bg-opacity-20 rounded-md"
            style={{ left: `${targetPosition.x}px`, top: `${targetPosition.y}px` }}
          />

          {/* Puzzle Piece */}
          <div
            ref={pieceRef}
            onMouseDown={handleMouseDown as any}
            onTouchStart={handleMouseDown as any}
            className={`absolute w-12 h-12 flex items-center justify-center rounded-md transition-all duration-300 ${isVerified ? 'bg-green-400 border-2 border-white' : 'bg-white shadow-lg cursor-grab'}`}
            style={{ 
              left: `${piecePosition.x}px`, 
              top: `${piecePosition.y}px`,
              transition: isDragging ? 'none' : 'all 0.3s ease',
            }}
          >
            {isVerified ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M5 12h.01M19 12h.01M5 5l.01.01M19 19l.01.01M5 19l.01-.01M19 5l.01.01" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AuthPage;
