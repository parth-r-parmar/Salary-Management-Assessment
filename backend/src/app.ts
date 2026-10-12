import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupStaticServing } from './middleware/staticServe';

dotenv.config();

export function createApp(): Express {
  const app: Express = express();

  // Basic middleware
  app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts/styles for React SPA in single container
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Setup SPA production static files
  setupStaticServing(app);

  return app;
}
