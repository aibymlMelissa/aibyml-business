import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'srm_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },
  
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4'
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
    }
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
  },
  
  websocket: {
    port: parseInt(process.env.WS_PORT || '3002')
  }
};