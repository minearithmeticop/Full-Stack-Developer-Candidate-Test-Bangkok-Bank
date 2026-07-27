import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xs" sx={{ mt: 12, textAlign: 'center' }}>
      <Typography variant="h1" color="primary" sx={{ fontSize: '5rem', fontWeight: 800 }}>
        404
      </Typography>
      <Typography variant="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/collections')}
      >
        Return to Collections
      </Button>
    </Container>
  );
};
