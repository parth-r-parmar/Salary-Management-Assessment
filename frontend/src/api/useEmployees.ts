import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import {
  Employee,
  PaginatedEmployeesResponse,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  FilterOptions,
} from '../types/api';

export interface EmployeeQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  department?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useEmployeesQuery(params: EmployeeQueryParams) {
  const queryParams = new URLSearchParams();
  queryParams.set('page', String(params.page));
  queryParams.set('pageSize', String(params.pageSize));

  if (params.search) queryParams.set('search', params.search);
  if (params.country) queryParams.set('country', params.country);
  if (params.department) queryParams.set('department', params.department);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

  return useQuery<PaginatedEmployeesResponse>({
    queryKey: ['employees', params],
    queryFn: () => apiClient<PaginatedEmployeesResponse>(`/api/employees?${queryParams.toString()}`),
    placeholderData: (previousData) => previousData,
  });
}

export function useFiltersQuery() {
  return useQuery<{ data: FilterOptions }>({
    queryKey: ['meta-filters'],
    queryFn: () => apiClient<{ data: FilterOptions }>('/api/meta/filters'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation<{ data: Employee }, Error, CreateEmployeePayload>({
    mutationFn: (payload) =>
      apiClient<{ data: Employee }>('/api/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation<{ data: Employee }, Error, { id: string; payload: UpdateEmployeePayload }>({
    mutationFn: ({ id, payload }) =>
      apiClient<{ data: Employee }>(`/api/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiClient<void>(`/api/employees/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
