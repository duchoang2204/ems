import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <ConstructionIcon sx={{ fontSize: 60, color: 'warning.main' }} />
        </Box>
        <Typography variant="h5" gutterBottom>
          Đang triển khai
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tính năng này đang trong quá trình phát triển
        </Typography>
      </Paper>
    </Container>
  );
};

export default PlaceholderPage; 