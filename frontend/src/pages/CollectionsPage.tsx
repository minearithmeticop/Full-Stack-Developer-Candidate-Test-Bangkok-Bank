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
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useNavigate } from 'react-router-dom';
import {
  useCreateCollection,
  useDeleteCollection,
  useGetCollectionsWithBookmarks,
  useUpdateCollection,
} from '../hooks/useCollections';
import { Collection } from '../types';

export const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: collections, isLoading, isError, error } = useGetCollectionsWithBookmarks();
  const createCollectionMutation = useCreateCollection();
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  // Edit Modal State
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete Confirm Modal State
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  const handleOpenCreate = () => {
    setCreateName('');
    setCreateDescription('');
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    await createCollectionMutation.mutateAsync({
      name: createName.trim(),
      description: createDescription.trim() || undefined,
    });
    handleCloseCreate();
  };

  const handleOpenEdit = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollection(collection);
    setEditName(collection.name);
    setEditDescription(collection.description || '');
  };

  const handleCloseEdit = () => {
    setEditingCollection(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection || !editName.trim()) return;

    await updateCollectionMutation.mutateAsync({
      id: editingCollection.id,
      payload: {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      },
    });
    handleCloseEdit();
  };

  const handleOpenDelete = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingCollection(collection);
  };

  const handleCloseDelete = () => {
    setDeletingCollection(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCollection) return;
    await deleteCollectionMutation.mutateAsync(deletingCollection.id);
    handleCloseDelete();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load collections: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h1" gutterBottom>
            My Collections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize and manage your personal links into structured collections.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          size="large"
        >
          New Collection
        </Button>
      </Box>

      {collections && collections.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <FolderOpenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            No Collections Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't created any link collections yet. Get started by creating your first collection!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Create Collection
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {collections?.map((collection) => (
            <Grid item xs={12} sm={6} md={4} key={collection.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 82, 204, 0.25)',
                  },
                }}
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <FolderIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h3" noWrap sx={{ fontSize: '1.2rem' }}>
                      {collection.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {collection.description || 'No description provided.'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      size="small"
                      label={`${collection.bookmarks?.length || 0} bookmarks`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5 }}>
                  <IconButton
                    size="small"
                    title="Edit Collection"
                    onClick={(e) => handleOpenEdit(collection, e)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    title="Delete Collection"
                    onClick={(e) => handleOpenDelete(collection, e)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreateOpen} onClose={handleCloseCreate} fullWidth maxWidth="xs">
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              required
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createCollectionMutation.isPending || !createName.trim()}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={!!editingCollection} onClose={handleCloseEdit} fullWidth maxWidth="xs">
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateCollectionMutation.isPending || !editName.trim()}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCollection} onClose={handleCloseDelete} maxWidth="xs">
        <DialogTitle>Delete Collection?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete collection "<strong>{deletingCollection?.name}</strong>"?
          </DialogContentText>
          <Alert severity="warning">
            Deleting this collection will NOT delete its bookmarks. All bookmarks inside will be moved to <strong>Uncategorized</strong>.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteCollectionMutation.isPending}
          >
            Delete Collection
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
