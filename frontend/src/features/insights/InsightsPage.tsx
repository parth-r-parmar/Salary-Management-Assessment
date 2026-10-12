import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  useInsightsSummaryQuery,
  useInsightsByCountryQuery,
  useInsightsByDepartmentQuery,
  useInsightsByJobTitleQuery,
  useInsightsDistributionQuery,
  useTopEarnersQuery,
} from '../../api/useInsights';
import { useFiltersQuery } from '../../api/useEmployees';
import { SummaryCards } from './SummaryCards';
import { CompensationTable } from './CompensationTable';
import { SalaryDistributionChart } from './SalaryDistributionChart';
import { TopEarnersList } from './TopEarnersList';

export const InsightsPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [tabIndex, setTabIndex] = useState(0);

  // Queries
  const { data: filtersData } = useFiltersQuery();
  const { data: summaryData, isLoading: summaryLoading } = useInsightsSummaryQuery();
  const { data: countryData, isLoading: countryLoading } = useInsightsByCountryQuery();
  const { data: deptData, isLoading: deptLoading } = useInsightsByDepartmentQuery(selectedCountry);
  const { data: jobData, isLoading: jobLoading } = useInsightsByJobTitleQuery(selectedCountry);
  const { data: distData, isLoading: distLoading } = useInsightsDistributionQuery(selectedCountry);
  const { data: topEarnersData, isLoading: topEarnersLoading } = useTopEarnersQuery(10, selectedCountry);

  const countries = filtersData?.data.countries || [
    { code: 'US', currency: 'USD' },
    { code: 'IN', currency: 'INR' },
    { code: 'GB', currency: 'GBP' },
    { code: 'DE', currency: 'EUR' },
  ];

  return (
    <Box>
      {/* Header and Scope Selector */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" fontWeight={700}>
            Compensation Analytics & Insights
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Statistical compensation distribution, medians, and quartiles calculated directly in PostgreSQL.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="insights-country-select-label">Country Currency Scope</InputLabel>
          <Select
            labelId="insights-country-select-label"
            label="Country Currency Scope"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.code} ({c.currency})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* High level KPI cards */}
      <SummaryCards summary={summaryData?.data} loading={summaryLoading} />

      {/* Analytics Tabs */}
      <Paper sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newVal) => setTabIndex(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={`By Job Title (${selectedCountry})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`By Department (${selectedCountry})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Country Overview (All)" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Distribution & Top Earners (${selectedCountry})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          {tabIndex === 0 && (
            <CompensationTable
              data={jobData?.data}
              groupColumnName="Job Title"
              loading={jobLoading}
              emptyMessage={`No job compensation records found for ${selectedCountry}.`}
            />
          )}

          {tabIndex === 1 && (
            <CompensationTable
              data={deptData?.data}
              groupColumnName="Department"
              loading={deptLoading}
              emptyMessage={`No department compensation records found for ${selectedCountry}.`}
            />
          )}

          {tabIndex === 2 && (
            <CompensationTable
              data={countryData?.data}
              groupColumnName="Country"
              loading={countryLoading}
            />
          )}

          {tabIndex === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <SalaryDistributionChart distribution={distData?.data} loading={distLoading} />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TopEarnersList
                  earners={topEarnersData?.data}
                  loading={topEarnersLoading}
                  country={selectedCountry}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
