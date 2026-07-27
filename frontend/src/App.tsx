import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FolderIcon from '@mui/icons-material/Folder';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { UserMenu } from './components/UserMenu';
import { BookmarksPage } from './pages/BookmarksPage';
import { CallbackPage } from './pages/CallbackPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isStandalonePage =
    location.pathname === '/login' || location.pathname === '/callback';

  const getBottomNavValue = () => {
    if (location.pathname.startsWith('/collections')) return 0;
    if (location.pathname.startsWith('/bookmarks')) return 1;
    return 0;
  };

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

              {/* Desktop Navigation Links */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    startIcon={<FolderIcon />}
                    color={
                      location.pathname.startsWith('/collections') ? 'primary' : 'inherit'
                    }
                    onClick={() => navigate('/collections')}
                  >
                    Collections
                  </Button>
                  <Button
                    startIcon={<BookmarkIcon />}
                    color={
                      location.pathname.startsWith('/bookmarks') ? 'primary' : 'inherit'
                    }
                    onClick={() => navigate('/bookmarks')}
                  >
                    All Bookmarks
                  </Button>
                </Box>
              )}

              {/* User Menu Component */}
              <UserMenu />
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Main Content Body */}
      <Box component="main" sx={{ flexGrow: 1, pb: isMobile ? 8 : 6 }}>
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

      {/* Mobile Bottom Navigation Bar */}
      {!isStandalonePage && isAuthenticated && isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderRadius: 0,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#0f172a',
          }}
          elevation={8}
        >
          <BottomNavigation
            showLabels
            value={getBottomNavValue()}
            onChange={(_, newValue) => {
              if (newValue === 0) navigate('/collections');
              if (newValue === 1) navigate('/bookmarks');
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <BottomNavigationAction label="Collections" icon={<FolderIcon />} />
            <BottomNavigationAction label="Bookmarks" icon={<BookmarkIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};
