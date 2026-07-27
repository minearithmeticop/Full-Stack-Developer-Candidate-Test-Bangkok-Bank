import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Navigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/collections" replace />;
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Card sx={{ p: 2, textAlign: 'center' }}>
        <CardContent>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 32 }} />
          </Box>
          <Typography variant="h2" gutterBottom>
            Bookmark Manager
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Secure Personal Bookmark Storage for Bangkok Bank Candidate Test
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={() => loginWithRedirect()}
          >
            Log In with Auth0 (PKCE OIDC)
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};
