import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { SalaryDistribution } from '../../types/api';
import { formatSalary } from '../../utils/formatters';

interface SalaryDistributionChartProps {
  distribution?: SalaryDistribution;
  loading: boolean;
}

export const SalaryDistributionChart: React.FC<SalaryDistributionChartProps> = ({
  distribution,
  loading,
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const buckets = distribution?.buckets || [];
  const currency = distribution?.currency || 'USD';

  if (buckets.length === 0) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No distribution data available for {distribution?.country || 'the selected country'}.
        </Typography>
      </Paper>
    );
  }

  const xLabels = buckets.map(
    (b) => `${formatSalary(b.rangeStart, currency)} - ${formatSalary(b.rangeEnd, currency)}`
  );
  const dataCounts = buckets.map((b) => b.count);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Salary Distribution Histogram ({distribution?.country} - {currency})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Headcount distribution grouped by bucket intervals of {formatSalary(distribution?.bucketSize || 25000, currency)}.
      </Typography>

      <Box sx={{ width: '100%', height: 350 }}>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xLabels,
              tickLabelStyle: {
                angle: -30,
                textAnchor: 'end',
                fontSize: 11,
              },
            },
          ]}
          series={[
            {
              data: dataCounts,
              label: 'Employee Count',
              color: '#0284c7',
            },
          ]}
          height={330}
          margin={{ top: 20, bottom: 80, left: 40, right: 20 }}
        />
      </Box>
    </Paper>
  );
};
