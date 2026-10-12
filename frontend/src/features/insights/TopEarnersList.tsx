import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { TopEarner } from '../../types/api';
import { formatSalary } from '../../utils/formatters';

interface TopEarnersListProps {
  earners?: TopEarner[];
  loading: boolean;
  country?: string;
}

export const TopEarnersList: React.FC<TopEarnersListProps> = ({ earners = [], loading, country }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return '#f59e0b'; // Gold
      case 1:
        return '#94a3b8'; // Silver
      case 2:
        return '#b45309'; // Bronze
      default:
        return '#e2e8f0';
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <EmojiEventsIcon sx={{ color: '#f59e0b' }} />
        <Typography variant="h6" fontWeight={600}>
          Top Compensated Employees {country ? `(${country})` : '(Organization-wide)'}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Highest salary earners in the selected scope.
      </Typography>

      <List disablePadding>
        {earners.map((emp, index) => (
          <React.Fragment key={emp.id}>
            <ListItem
              alignItems="flex-start"
              sx={{ px: 1, py: 1.5 }}
              secondaryAction={
                <Chip
                  label={formatSalary(emp.annualSalary, emp.currency)}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getRankBadgeColor(index),
                    color: index < 3 ? '#ffffff' : '#475569',
                    width: 32,
                    height: 32,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={600}>
                    {emp.fullName}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {emp.jobTitle} • {emp.department} ({emp.country})
                  </Typography>
                }
              />
            </ListItem>
            {index < earners.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};
