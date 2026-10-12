import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { FilterOptions } from '../../types/api';

interface EmployeeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  country: string;
  onCountryChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  onReset: () => void;
  filterOptions?: FilterOptions;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  search,
  onSearchChange,
  country,
  onCountryChange,
  department,
  onDepartmentChange,
  onReset,
  filterOptions,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        mb: 2.5,
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name, email, or job title..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 320, flex: { xs: '1 1 100%', md: '1 1 auto' } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="country-filter-label">Country</InputLabel>
        <Select
          labelId="country-filter-label"
          label="Country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <MenuItem value="">
            <em>All Countries</em>
          </MenuItem>
          {filterOptions?.countries.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.code} ({c.currency})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="department-filter-label">Department</InputLabel>
        <Select
          labelId="department-filter-label"
          label="Department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <MenuItem value="">
            <em>All Departments</em>
          </MenuItem>
          {filterOptions?.departments.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {(Boolean(search) || Boolean(country) || Boolean(department)) && (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={onReset}
          startIcon={<RestartAltIcon />}
          sx={{ textTransform: 'none', height: 40 }}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
};
