import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // For demo purposes, simulate WebSocket connection
    setIsConnected(true);
    
    // Simulate receiving messages
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const mockMessage: WebSocketMessage = {
          type: 'request_updated',
          data: { id: 'mock', status: 'registered' }
        };
        setLastMessage(mockMessage);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  return { isConnected, lastMessage };
}
