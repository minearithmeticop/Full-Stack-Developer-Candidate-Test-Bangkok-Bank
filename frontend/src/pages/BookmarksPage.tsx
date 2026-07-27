import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetBookmarks, useCreateBookmark, useUpdateBookmark, useDeleteBookmark } from '../hooks/useBookmarks';
import { useGetCollection, useGetCollections } from '../hooks/useCollections';
import { Bookmark } from '../types';
import { normalizeUrl } from '../utils/normalizeUrl';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: paramCollectionId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryCollectionId = searchParams.get('collectionId') || undefined;
  const activeCollectionId = paramCollectionId || queryCollectionId;

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Collections for dropdown selection
  const { data: collections } = useGetCollections();
  const { data: currentCollection } = useGetCollection(paramCollectionId);

  // Fetch Bookmarks
  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
  } = useGetBookmarks(activeCollectionId, searchQuery);

  const createBookmarkMutation = useCreateBookmark();
  const updateBookmarkMutation = useUpdateBookmark();
  const deleteBookmarkMutation = useDeleteBookmark();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createUrl, setCreateUrl] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createNotes, setCreateNotes] = useState('');
  const [createCollectionId, setCreateCollectionId] = useState<string>(
    activeCollectionId || '',
  );

  // Edit Modal State
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCollectionId, setEditCollectionId] = useState<string>('');

  // Delete Confirm Modal State
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);

  const handleOpenCreate = () => {
    setCreateUrl('');
    setCreateTitle('');
    setCreateNotes('');
    setCreateCollectionId(
      activeCollectionId === 'uncategorized' ? '' : activeCollectionId || '',
    );
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUrl.trim() || !createTitle.trim()) return;

    const normalized = normalizeUrl(createUrl);

    await createBookmarkMutation.mutateAsync({
      url: normalized,
      title: createTitle.trim(),
      notes: createNotes.trim() || undefined,
      collectionId: createCollectionId || null,
    });

    handleCloseCreate();
  };

  const handleOpenEdit = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBookmark(bookmark);
    setEditUrl(bookmark.url);
    setEditTitle(bookmark.title);
    setEditNotes(bookmark.notes || '');
    setEditCollectionId(bookmark.collectionId || '');
  };

  const handleCloseEdit = () => {
    setEditingBookmark(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookmark || !editUrl.trim() || !editTitle.trim()) return;

    const normalized = normalizeUrl(editUrl);

    await updateBookmarkMutation.mutateAsync({
      id: editingBookmark.id,
      payload: {
        url: normalized,
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined,
        collectionId: editCollectionId || null,
      },
    });

    handleCloseEdit();
  };

  const handleOpenDelete = (bookmark: Bookmark, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingBookmark(bookmark);
  };

  const handleCloseDelete = () => {
    setDeletingBookmark(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBookmark) return;
    await deleteBookmarkMutation.mutateAsync(deletingBookmark.id);
    handleCloseDelete();
  };

  const handleFilterCollectionChange = (newColId: string) => {
    if (newColId) {
      setSearchParams({ collectionId: newColId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header Bar */}
      <Box sx={{ mb: 4 }}>
        {paramCollectionId && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/collections')}
            sx={{ mb: 2 }}
          >
            Back to Collections
          </Button>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h1" gutterBottom>
              {paramCollectionId
                ? currentCollection?.name || 'Collection Bookmarks'
                : 'All Bookmarks'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {paramCollectionId
                ? currentCollection?.description || 'Bookmarks inside this collection'
                : 'Search and manage all your saved web links.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            size="large"
          >
            Add Bookmark
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2, mb: 4, backgroundColor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={paramCollectionId ? 12 : 7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title, URL, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {!paramCollectionId && (
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="collection-filter-label">Filter Collection</InputLabel>
                <Select
                  labelId="collection-filter-label"
                  value={queryCollectionId || ''}
                  label="Filter Collection"
                  onChange={(e) => handleFilterCollectionChange(e.target.value)}
                >
                  <MenuItem value="">All Collections</MenuItem>
                  <MenuItem value="uncategorized">Uncategorized</MenuItem>
                  {collections?.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {col.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Card>

      {/* Loading / Error States */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          Failed to load bookmarks: {(error as Error).message}
        </Alert>
      ) : bookmarks && bookmarks.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <BookmarkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            No Bookmarks Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery
              ? 'No bookmarks match your search query.'
              : 'There are no bookmarks saved here yet.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add First Bookmark
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {bookmarks?.map((bookmark) => {
            const matchedCol = collections?.find(
              (c) => c.id === bookmark.collectionId,
            );
            return (
              <Grid item xs={12} sm={6} md={4} key={bookmark.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {bookmark.title}
                      </Typography>
                      <IconButton
                        size="small"
                        component={Link}
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Link"
                        sx={{ color: 'primary.main', ml: 1 }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Link
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      color="secondary.main"
                      sx={{
                        display: 'block',
                        wordBreak: 'break-all',
                        mb: 1.5,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {bookmark.url}
                    </Link>

                    {bookmark.notes && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {bookmark.notes}
                      </Typography>
                    )}
                  </CardContent>

                  <Box>
                    <Box
                      sx={{
                        px: 2,
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {matchedCol ? (
                        <Chip
                          size="small"
                          label={matchedCol.name}
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Uncategorized"
                          color="default"
                          variant="outlined"
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
                      <IconButton
                        size="small"
                        title="Edit Bookmark"
                        onClick={(e) => handleOpenEdit(bookmark, e)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        title="Delete Bookmark"
                        onClick={(e) => handleOpenDelete(bookmark, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Bookmark Dialog */}
      <Dialog open={isCreateOpen} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Add New Bookmark</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="URL (e.g. www.google.com)"
              type="text"
              fullWidth
              required
              value={createUrl}
              onChange={(e) => setCreateUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              required
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Notes (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={createNotes}
              onChange={(e) => setCreateNotes(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="create-collection-select-label">Collection</InputLabel>
              <Select
                labelId="create-collection-select-label"
                value={createCollectionId}
                label="Collection"
                onChange={(e) => setCreateCollectionId(e.target.value)}
              >
                <MenuItem value="">Uncategorized</MenuItem>
                {collections?.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createBookmarkMutation.isPending ||
                !createUrl.trim() ||
                !createTitle.trim()
              }
            >
              Add Bookmark
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Bookmark Dialog */}
      <Dialog open={!!editingBookmark} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="URL"
              type="text"
              fullWidth
              required
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Notes (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="edit-collection-select-label">Collection</InputLabel>
              <Select
                labelId="edit-collection-select-label"
                value={editCollectionId}
                label="Collection"
                onChange={(e) => setEditCollectionId(e.target.value)}
              >
                <MenuItem value="">Uncategorized</MenuItem>
                {collections?.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                updateBookmarkMutation.isPending ||
                !editUrl.trim() ||
                !editTitle.trim()
              }
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingBookmark} onClose={handleCloseDelete} maxWidth="xs">
        <DialogTitle>Delete Bookmark?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete bookmark "<strong>{deletingBookmark?.title}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteBookmarkMutation.isPending}
          >
            Delete Bookmark
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
