import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CallbackPage: React.FC = () => {
  const { isAuthenticated, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/collections', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          Authentication Failed
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress size={48} thickness={4} color="primary" />
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Processing Auth0 Authentication Callback...
      </Typography>
    </Box>
  );
};
