import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { BookmarksPage } from './pages/BookmarksPage';
import { CallbackPage } from './pages/CallbackPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const isStandalonePage =
    location.pathname === '/login' || location.pathname === '/callback';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isStandalonePage && isAuthenticated && (
        <AppBar position="sticky" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/collections')}
              >
                <BookmarkIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Bookmark Manager
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  startIcon={<FolderIcon />}
                  color={location.pathname.startsWith('/collections') ? 'primary' : 'inherit'}
                  onClick={() => navigate('/collections')}
                >
                  Collections
                </Button>
                <Button
                  startIcon={<BookmarkIcon />}
                  color={location.pathname === '/bookmarks' ? 'primary' : 'inherit'}
                  onClick={() => navigate('/bookmarks')}
                >
                  All Bookmarks
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user?.picture && (
                  <Avatar
                    src={user.picture}
                    alt={user.name || 'User Avatar'}
                    sx={{ width: 36, height: 36 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary">
                  {user?.email || user?.name}
                </Typography>
                <IconButton
                  color="inherit"
                  title="Log Out"
                  onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin } })
                  }
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}

      <Box component="main" sx={{ flexGrow: 1, pb: 6 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/collections" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:id" element={<BookmarksPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Box>
  );
};
