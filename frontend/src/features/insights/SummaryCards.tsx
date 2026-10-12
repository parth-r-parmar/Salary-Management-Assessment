import React from 'react';
import { Grid, Paper, Typography, Box, Skeleton, Chip } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PublicIcon from '@mui/icons-material/Public';
import PaymentsIcon from '@mui/icons-material/Payments';
import { OrgSummary } from '../../types/api';
import { formatSalary } from '../../utils/formatters';

interface SummaryCardsProps {
  summary?: OrgSummary;
  loading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Total Headcount */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.dark',
              display: 'flex',
            }}
          >
            <PeopleAltIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Total Headcount
            </Typography>
            {loading ? (
              <Skeleton width={80} height={36} />
            ) : (
              <Typography variant="h5" fontWeight={700}>
                {summary?.totalHeadcount?.toLocaleString() || 0}
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Total Countries */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
            }}
          >
            <PublicIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Global Countries
            </Typography>
            {loading ? (
              <Skeleton width={50} height={36} />
            ) : (
              <Typography variant="h5" fontWeight={700}>
                {summary?.countryCount || 0}
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Payroll by Currency */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
              }}
            >
              <PaymentsIcon fontSize="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Total Annual Payroll by Currency (Zero Cross-Currency Aggregation)
            </Typography>
          </Box>

          {loading ? (
            <Skeleton width="100%" height={32} />
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {summary?.payrollByCurrency.map((p) => (
                <Chip
                  key={p.currency}
                  label={`${p.currency}: ${formatSalary(p.totalPayroll, p.currency)} (${p.headcount} staff)`}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: '#f8fafc',
                    fontWeight: 600,
                    borderColor: '#cbd5e1',
                    fontSize: '0.8rem',
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
