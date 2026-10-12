import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee, CreateEmployeePayload, FilterOptions } from '../../types/api';

const employeeFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  email: z.string().trim().email('Invalid email address'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  department: z.string().trim().min(1, 'Department is required'),
  country: z.string().trim().length(2, 'Country must be 2-letter ISO code'),
  currency: z.string().trim().length(3, 'Currency must be 3-letter ISO code'),
  annualSalary: z.coerce.number().positive('Salary must be greater than 0'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']),
  hireDate: z.string().min(1, 'Hire date is required'),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeePayload) => Promise<void>;
  employee?: Employee | null;
  filterOptions?: FilterOptions;
  isSubmitting: boolean;
}

export const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  employee,
  filterOptions,
  isSubmitting,
}) => {
  const isEditing = Boolean(employee);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      jobTitle: '',
      department: '',
      country: '',
      currency: '',
      annualSalary: 0,
      employmentType: 'FULL_TIME',
      hireDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCountry = watch('country');

  // Auto-sync currency when country is selected
  useEffect(() => {
    if (selectedCountry && filterOptions?.countries) {
      const match = filterOptions.countries.find((c) => c.code === selectedCountry);
      if (match) {
        setValue('currency', match.currency);
      }
    }
  }, [selectedCountry, filterOptions, setValue]);

  // Reset or initialize form on dialog open/close or employee change
  useEffect(() => {
    if (employee) {
      reset({
        fullName: employee.fullName,
        email: employee.email,
        jobTitle: employee.jobTitle,
        department: employee.department,
        country: employee.country,
        currency: employee.currency,
        annualSalary: employee.annualSalary,
        employmentType: employee.employmentType,
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        jobTitle: '',
        department: filterOptions?.departments[0] || 'Engineering',
        country: filterOptions?.countries[0]?.code || 'US',
        currency: filterOptions?.countries[0]?.currency || 'USD',
        annualSalary: 60000,
        employmentType: 'FULL_TIME',
        hireDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [employee, open, reset, filterOptions]);

  const handleFormSubmit = async (data: EmployeeFormData) => {
    await onSubmit({
      ...data,
      hireDate: new Date(data.hireDate).toISOString(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    size="small"
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    fullWidth
                    size="small"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job Title"
                    fullWidth
                    size="small"
                    error={Boolean(errors.jobTitle)}
                    helperText={errors.jobTitle?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    select
                    fullWidth
                    size="small"
                    error={Boolean(errors.department)}
                    helperText={errors.department?.message}
                  >
                    {filterOptions?.departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    select
                    fullWidth
                    size="small"
                    error={Boolean(errors.country)}
                    helperText={errors.country?.message}
                  >
                    {filterOptions?.countries.map((c) => (
                      <MenuItem key={c.code} value={c.code}>
                        {c.code} ({c.currency})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Currency"
                    fullWidth
                    size="small"
                    disabled
                    error={Boolean(errors.currency)}
                    helperText={errors.currency?.message || 'Auto-set from country'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="annualSalary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Annual Gross Salary"
                    type="number"
                    fullWidth
                    size="small"
                    error={Boolean(errors.annualSalary)}
                    helperText={errors.annualSalary?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employment Type"
                    select
                    fullWidth
                    size="small"
                    error={Boolean(errors.employmentType)}
                    helperText={errors.employmentType?.message}
                  >
                    <MenuItem value="FULL_TIME">Full Time</MenuItem>
                    <MenuItem value="PART_TIME">Part Time</MenuItem>
                    <MenuItem value="CONTRACT">Contract</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="hireDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hire Date"
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.hireDate)}
                    helperText={errors.hireDate?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
