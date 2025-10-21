import WebSocket from 'ws';
import { ServiceRequest } from '../types/index.js';

export class WebSocketService {
  private wss: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      ws.send(JSON.stringify({
        type: 'connection_established',
        timestamp: new Date().toISOString()
      }));
    });
  }

  broadcast(eventType: string, data: any): void {
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        this.clients.delete(client);
      }
    });
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  close(): void {
    this.clients.forEach(client => client.close());
    this.wss.close();
  }
}