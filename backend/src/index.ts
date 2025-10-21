import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { WebSocketService } from './services/websocket-service.js';
import { createServiceRequestRoutes } from './routes/service-requests.js';
import { createChatbotRoutes } from './routes/chatbot.js';

const app = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const wsService = new WebSocketService(config.websocket.port);

app.use('/api/service-requests', createServiceRequestRoutes(wsService));
app.use('/api/chatbot', createChatbotRoutes());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    websocketClients: wsService.getConnectedClientsCount()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`WebSocket server running on port ${config.websocket.port}`);
});

const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    wsService.close();
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);