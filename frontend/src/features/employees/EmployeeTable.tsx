import React, { useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Employee } from '../../types/api';
import { formatSalary, formatDate } from '../../utils/formatters';

interface EmployeeTableProps {
  employees: Employee[];
  totalCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  totalCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef<Employee>[] = useMemo(
    () => [
      {
        field: 'fullName',
        headerName: 'Full Name',
        flex: 1.2,
        minWidth: 160,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.3,
        minWidth: 200,
      },
      {
        field: 'jobTitle',
        headerName: 'Job Title',
        flex: 1.2,
        minWidth: 180,
      },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'country',
        headerName: 'Country',
        width: 90,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'annualSalary',
        headerName: 'Annual Salary',
        width: 160,
        align: 'right',
        headerAlign: 'right',
        valueGetter: (_value, row) => formatSalary(row.annualSalary, row.currency),
      },
      {
        field: 'employmentType',
        headerName: 'Type',
        width: 130,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const type = params.row.employmentType;
          const color =
            type === 'FULL_TIME' ? 'primary' : type === 'PART_TIME' ? 'info' : 'warning';
          return (
            <Chip
              label={type.replace('_', ' ')}
              color={color}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: '0.75rem' }}
            />
          );
        },
      },
      {
        field: 'hireDate',
        headerName: 'Hire Date',
        width: 120,
        valueGetter: (_value, row) => formatDate(row.hireDate),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit Employee">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(params.row)}
                aria-label={`Edit ${params.row.fullName}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Employee">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(params.row)}
                aria-label={`Delete ${params.row.fullName}`}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Box sx={{ height: 650, width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
      <DataGrid
        rows={employees}
        columns={columns}
        rowCount={totalCount}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          '& .MuiDataGrid-cell': {
            borderColor: '#f1f5f9',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f8fafc',
            borderBottom: '2px solid #e2e8f0',
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};
