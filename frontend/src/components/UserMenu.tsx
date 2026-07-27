import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ p: 0.5 }}
      >
        <Avatar
          src={user?.picture}
          alt={user?.name || user?.email || 'User Avatar'}
          sx={{ width: 36, height: 36, border: '2px solid rgba(255, 255, 255, 0.2)' }}
        >
          <PersonIcon />
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: {
            minWidth: 220,
            mt: 1,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.name || 'User Profile'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {user?.email}
          </Typography>
          {user?.sub && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.68rem', opacity: 0.7 }}
              noWrap
              display="block"
            >
              {user.sub}
            </Typography>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </>
  );
};
