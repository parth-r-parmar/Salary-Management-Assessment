import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupStaticServing } from './middleware/staticServe';
import { errorHandler } from './middleware/errorHandler';
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

  // Basic middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
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
