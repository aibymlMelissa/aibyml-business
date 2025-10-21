import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface TalkingFaceProps {
  isActive: boolean;
  message?: string;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

export function TalkingFace({ message, onSpeakingStateChange }: TalkingFaceProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [animationState, setAnimationState] = useState<'idle' | 'speaking' | 'listening'>('idle');

  useEffect(() => {
    if (message && speechEnabled && 'speechSynthesis' in window) {
      speakMessage(message);
    }
  }, [message, speechEnabled]);

  const speakMessage = (text: string) => {
    if (!text || !speechEnabled) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAnimationState('speaking');
      onSpeakingStateChange?.(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAnimationState('idle');
      onSpeakingStateChange?.(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAnimationState('idle');
      onSpeakingStateChange?.(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    setSpeechEnabled(!speechEnabled);
  };

  const getFaceExpression = () => {
    switch (animationState) {
      case 'speaking':
        return '😊'; // Happy/friendly expression when speaking
      case 'listening':
        return '🤔'; // Thoughtful expression when listening
      default:
        return '😊'; // Default friendly expression
    }
  };

  const getAnimationClass = () => {
    switch (animationState) {
      case 'speaking':
        return 'animate-pulse';
      case 'listening':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      {/* Future Enhancement: Replace with actual 3D avatar */}
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl shadow-lg border-2 border-white ${getAnimationClass()}`}>
        <span className="text-2xl">{getFaceExpression()}</span>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Speech control */}
      <button
        onClick={toggleSpeech}
        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
        title={speechEnabled ? 'Disable speech' : 'Enable speech'}
      >
        {isSpeaking ? (
          <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
        ) : speechEnabled ? (
          <Volume2 className="w-3 h-3 text-blue-600" />
        ) : (
          <VolumeX className="w-3 h-3 text-gray-400" />
        )}
      </button>

      {/* Future Enhancement: Mouth movement visualization */}
      <div className="absolute inset-0 rounded-full pointer-events-none">
        {isSpeaking && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
        )}
      </div>

      {/* Future Enhancement: Eye tracking/blinking */}
      <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
    </div>
  );
}

// Future Enhancement: Integration notes
/*
FUTURE TALKING FACE ENHANCEMENTS:

1. 3D Avatar Integration:
   - Replace emoji with actual 3D avatar (using libraries like Three.js, Ready Player Me, or VTuber solutions)
   - Implement facial rigging and animation system
   - Add lip-sync capabilities based on speech synthesis

2. Advanced Speech Features:
   - Voice selection (male/female, different accents)
   - Emotion-based voice modulation
   - Interrupt and resume speech functionality
   - Speech rate and pitch controls

3. Visual Enhancements:
   - Realistic facial expressions matching conversation context
   - Eye movement and blinking animations
   - Head movement and gestures
   - Background/lighting effects

4. AI Integration:
   - Emotion detection from conversation context
   - Dynamic expression changes based on message sentiment
   - Personalized avatar appearance based on user preferences

5. Accessibility:
   - Screen reader compatibility
   - High contrast mode
   - Keyboard navigation support
   - Subtitle/captions display

6. Performance:
   - WebGL optimization for 3D rendering
   - Efficient animation systems
   - Mobile device compatibility
   - Bandwidth-conscious asset loading

Implementation suggestions:
- Use React Three Fiber for 3D avatar rendering
- Implement WebRTC for real-time audio processing
- Use facial landmark detection for expression mapping
- Consider cloud-based avatar generation services
*/