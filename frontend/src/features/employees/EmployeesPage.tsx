import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { Employee, CreateEmployeePayload } from '../../types/api';
import {
  useEmployeesQuery,
  useFiltersQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '../../api/useEmployees';
import { useDebounce } from '../../hooks/useDebounce';
import { EmployeeFilters } from './EmployeeFilters';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeDialog } from './EmployeeDialog';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';

export const EmployeesPage: React.FC = () => {
  // Query parameters state
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ]);

  // Dialog & Modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Snackbar feedback state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Queries & Mutations
  const { data: filtersData } = useFiltersQuery();
  const { data, isLoading } = useEmployeesQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    country: country || undefined,
    department: department || undefined,
    sortBy: sortModel[0]?.field || 'createdAt',
    sortOrder: sortModel[0]?.sort || 'desc',
  });

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const handleOpenAddDialog = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleSaveEmployee = async (formData: CreateEmployeePayload) => {
    try {
      if (selectedEmployee) {
        await updateMutation.mutateAsync({
          id: selectedEmployee.id,
          payload: formData,
        });
        setSnackbar({
          open: true,
          message: `Successfully updated employee ${formData.fullName}`,
          severity: 'success',
        });
      } else {
        await createMutation.mutateAsync(formData);
        setSnackbar({
          open: true,
          message: `Successfully added employee ${formData.fullName}`,
          severity: 'success',
        });
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteMutation.mutateAsync(employeeToDelete.id);
      setSnackbar({
        open: true,
        message: `Employee ${employeeToDelete.fullName} removed successfully`,
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete employee';
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error',
      });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountry('');
    setDepartment('');
    setPaginationModel({ page: 0, pageSize: 25 });
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" fontWeight={700}>
            Employee Salary Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Displaying {data?.meta.totalCount ? data.meta.totalCount.toLocaleString() : '...'} organizational records with server-side pagination and filters.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ textTransform: 'none', fontWeight: 600, px: 2.5 }}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <EmployeeFilters
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          country={country}
          onCountryChange={(val) => {
            setCountry(val);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          department={department}
          onDepartmentChange={(val) => {
            setDepartment(val);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          onReset={handleResetFilters}
          filterOptions={filtersData?.data}
        />

        <EmployeeTable
          employees={data?.data || []}
          totalCount={data?.meta.totalCount || 0}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDeleteDialog}
        />
      </Paper>

      {/* Add / Edit Dialog */}
      <EmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveEmployee}
        employee={selectedEmployee}
        filterOptions={filtersData?.data}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Confirm Employee Deletion"
        message={`Are you sure you want to delete employee "${employeeToDelete?.fullName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialogOpen(false)}
        isDeleting={deleteMutation.isPending}
      />

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%', fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
