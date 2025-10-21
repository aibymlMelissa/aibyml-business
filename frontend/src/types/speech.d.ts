// Speech Recognition API type declarations
interface Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognition: typeof SpeechRecognition;
}

declare class SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}