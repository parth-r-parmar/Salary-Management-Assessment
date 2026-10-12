import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';
import { setupStaticServing } from './middleware/staticServe';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';
import { EmployeeService } from './services/employeeService';
import { EmployeeController } from './controllers/employeeController';
import { createEmployeeRouter } from './routes/employeeRoutes';
import { PrismaEmployeeRepository } from './repositories/PrismaEmployeeRepository';
import { InsightsService } from './services/insightsService';
import { InsightsController } from './controllers/insightsController';
import { createInsightsRouter } from './routes/insightsRoutes';
import { PrismaInsightsRepository } from './repositories/PrismaInsightsRepository';
import { prisma } from './db/client';

dotenv.config();

export interface AppOptions {
  employeeService?: EmployeeService;
  insightsService?: InsightsService;
}

export function createApp(options?: AppOptions): Express {
  const app: Express = express();

  // Basic security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // Structured logging (disabled in test runs)
  if (process.env.NODE_ENV !== 'test') {
    app.use(pinoHttp({ level: process.env.LOG_LEVEL || 'info' }));
  }

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Services & Controllers Setup
  const employeeService =
    options?.employeeService || new EmployeeService(new PrismaEmployeeRepository(prisma));
  const employeeController = new EmployeeController(employeeService);

  const insightsService =
    options?.insightsService || new InsightsService(new PrismaInsightsRepository(prisma));
  const insightsController = new InsightsController(insightsService);

  // Apply rate limiter to all API routes
  app.use('/api', apiRateLimiter);

  // Mount API Routes
  app.use('/api/employees', createEmployeeRouter(employeeController));
  app.use('/api/insights', createInsightsRouter(insightsController));
  app.get('/api/meta/filters', employeeController.getFilters);

  // Setup SPA production static files
  setupStaticServing(app);

  // Central Error Handler Middleware
  app.use(errorHandler);

  return app;
}
