import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import {
  OrgSummary,
  AggregatedCompensation,
  SalaryDistribution,
  TopEarner,
} from '../types/api';

export function useInsightsSummaryQuery() {
  return useQuery<{ data: OrgSummary }>({
    queryKey: ['insights', 'summary'],
    queryFn: () => apiClient<{ data: OrgSummary }>('/api/insights/summary'),
  });
}

export function useInsightsByCountryQuery() {
  return useQuery<{ data: AggregatedCompensation[] }>({
    queryKey: ['insights', 'by-country'],
    queryFn: () => apiClient<{ data: AggregatedCompensation[] }>('/api/insights/by-country'),
  });
}

export function useInsightsByDepartmentQuery(country?: string) {
  const url = country
    ? `/api/insights/by-department?country=${encodeURIComponent(country)}`
    : '/api/insights/by-department';

  return useQuery<{ data: AggregatedCompensation[] }>({
    queryKey: ['insights', 'by-department', country],
    queryFn: () => apiClient<{ data: AggregatedCompensation[] }>(url),
  });
}

export function useInsightsByJobTitleQuery(country?: string) {
  const url = country
    ? `/api/insights/by-job-title?country=${encodeURIComponent(country)}`
    : '/api/insights/by-job-title';

  return useQuery<{ data: AggregatedCompensation[] }>({
    queryKey: ['insights', 'by-job-title', country],
    queryFn: () => apiClient<{ data: AggregatedCompensation[] }>(url),
  });
}

export function useInsightsDistributionQuery(country: string, bucketSize = 25000) {
  return useQuery<{ data: SalaryDistribution }>({
    queryKey: ['insights', 'distribution', country, bucketSize],
    queryFn: () =>
      apiClient<{ data: SalaryDistribution }>(
        `/api/insights/distribution?country=${encodeURIComponent(country)}&bucketSize=${bucketSize}`
      ),
    enabled: Boolean(country),
  });
}

export function useTopEarnersQuery(limit = 10, country?: string) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (country) params.set('country', country);

  return useQuery<{ data: TopEarner[] }>({
    queryKey: ['insights', 'top-earners', limit, country],
    queryFn: () => apiClient<{ data: TopEarner[] }>(`/api/insights/top-earners?${params.toString()}`),
  });
}
