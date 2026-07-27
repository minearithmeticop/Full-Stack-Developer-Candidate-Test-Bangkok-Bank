import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          {id ? `Bookmarks in Collection: ${id}` : 'All Bookmarks'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          TODO: Manage and search your saved links.
        </Typography>
      </Box>
    </Container>
  );
};
