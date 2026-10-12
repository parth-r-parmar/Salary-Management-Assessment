import { Router } from 'express';
import { InsightsController } from '../controllers/insightsController';

export function createInsightsRouter(controller: InsightsController): Router {
  const router = Router();

  router.get('/summary', controller.getSummary);
  router.get('/by-country', controller.getByCountry);
  router.get('/by-department', controller.getByDepartment);
  router.get('/by-job-title', controller.getByJobTitle);
  router.get('/distribution', controller.getDistribution);
  router.get('/top-earners', controller.getTopEarners);

  return router;
}
