import { Request, Response, NextFunction } from 'express';
import { InsightsService } from '../services/insightsService';
import {
  countryFilterQuerySchema,
  distributionQuerySchema,
  topEarnersQuerySchema,
} from '../schemas/insightsSchema';

export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.insightsService.getSummary();
      res.status(200).json({ data: summary });
    } catch (err) {
      next(err);
    }
  };

  getByCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.insightsService.getByCountry();
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  getByDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = countryFilterQuerySchema.parse(req.query);
      const result = await this.insightsService.getByDepartment(query.country);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  getByJobTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = countryFilterQuerySchema.parse(req.query);
      const result = await this.insightsService.getByJobTitle(query.country);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  getDistribution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = distributionQuerySchema.parse(req.query);
      const result = await this.insightsService.getDistribution(
        query.country,
        query.bucketSize
      );
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  getTopEarners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = topEarnersQuerySchema.parse(req.query);
      const result = await this.insightsService.getTopEarners(query.limit, query.country);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}
