import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AggregatedCompensation } from '../../types/api';
import { formatSalary } from '../../utils/formatters';

interface CompensationTableProps {
  data?: AggregatedCompensation[];
  groupColumnName: string;
  loading: boolean;
  emptyMessage?: string;
}

type SortField = 'groupKey' | 'headcount' | 'min' | 'p25' | 'median' | 'p75' | 'max' | 'avg';

export const CompensationTable: React.FC<CompensationTableProps> = ({
  data = [],
  groupColumnName,
  loading,
  emptyMessage = 'No compensation data found for the selected filter.',
}) => {
  const [orderBy, setOrderBy] = useState<SortField>('headcount');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleRequestSort = (property: SortField) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    const list = [...data];
    list.sort((a, b) => {
      let valA: string | number = a[orderBy];
      let valB: string | number = b[orderBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
        return order === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      }

      return order === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
    return list;
  }, [data, orderBy, order]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small" aria-label={`${groupColumnName} compensation table`}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'groupKey'}
                direction={orderBy === 'groupKey' ? order : 'asc'}
                onClick={() => handleRequestSort('groupKey')}
              >
                {groupColumnName}
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Currency</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'headcount'}
                direction={orderBy === 'headcount' ? order : 'asc'}
                onClick={() => handleRequestSort('headcount')}
              >
                Headcount
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'min'}
                direction={orderBy === 'min' ? order : 'asc'}
                onClick={() => handleRequestSort('min')}
              >
                Min
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'p25'}
                direction={orderBy === 'p25' ? order : 'asc'}
                onClick={() => handleRequestSort('p25')}
              >
                P25
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
              <TableSortLabel
                active={orderBy === 'median'}
                direction={orderBy === 'median' ? order : 'asc'}
                onClick={() => handleRequestSort('median')}
              >
                Median (P50)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'p75'}
                direction={orderBy === 'p75' ? order : 'asc'}
                onClick={() => handleRequestSort('p75')}
              >
                P75
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'max'}
                direction={orderBy === 'max' ? order : 'asc'}
                onClick={() => handleRequestSort('max')}
              >
                Max
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              <TableSortLabel
                active={orderBy === 'avg'}
                direction={orderBy === 'avg' ? order : 'asc'}
                onClick={() => handleRequestSort('avg')}
              >
                Average
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={`${row.groupKey}_${row.currency}`} hover>
              <TableCell sx={{ fontWeight: 500 }}>{row.groupKey}</TableCell>
              <TableCell>{row.currency}</TableCell>
              <TableCell align="right">{row.headcount.toLocaleString()}</TableCell>
              <TableCell align="right">{formatSalary(row.min, row.currency)}</TableCell>
              <TableCell align="right">{formatSalary(row.p25, row.currency)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                {formatSalary(row.median, row.currency)}
              </TableCell>
              <TableCell align="right">{formatSalary(row.p75, row.currency)}</TableCell>
              <TableCell align="right">{formatSalary(row.max, row.currency)}</TableCell>
              <TableCell align="right">{formatSalary(row.avg, row.currency)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
