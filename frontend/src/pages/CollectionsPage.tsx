import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export const CollectionsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          My Collections
        </Typography>
        <Typography variant="body1" color="text.secondary">
          TODO: Manage and organize your link collections.
        </Typography>
      </Box>
    </Container>
  );
};
