import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { queryClient } from './api/queries';
import { theme } from './theme';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-yg.us.auth0.com';
const clientId =
  import.meta.env.VITE_AUTH0_CLIENT_ID || 'H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA';
const audience =
  import.meta.env.VITE_AUTH0_AUDIENCE || 'https://bbl-candidate-test-api';
const redirectUri =
  import.meta.env.VITE_AUTH0_REDIRECT_URI || 'http://localhost:3000/callback';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>,
);
