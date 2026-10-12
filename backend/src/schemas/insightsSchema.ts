import { z } from 'zod';

export const countryFilterQuerySchema = z.object({
  country: z.string().trim().length(2).toUpperCase().optional(),
});

export const distributionQuerySchema = z.object({
  country: z.string().trim().length(2, 'Country code must be 2 characters').toUpperCase(),
  bucketSize: z.coerce.number().int().min(1000).default(25000),
});

export const topEarnersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  country: z.string().trim().length(2).toUpperCase().optional(),
});
