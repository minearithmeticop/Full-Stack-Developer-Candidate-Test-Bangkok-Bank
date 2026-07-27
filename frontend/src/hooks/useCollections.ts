import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../types';

export function useGetCollections() {
  return useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await apiClient.get<Collection[]>('/api/v1/collections');
      return response.data;
    },
  });
}

export function useGetCollectionsWithBookmarks() {
  return useQuery<Collection[]>({
    queryKey: ['collections', 'with-bookmarks'],
    queryFn: async () => {
      const response = await apiClient.get<Collection[]>('/api/v1/collections/all');
      return response.data;
    },
  });
}

export function useGetCollection(id?: string) {
  return useQuery<Collection>({
    queryKey: ['collections', id],
    queryFn: async () => {
      const response = await apiClient.get<Collection>(`/api/v1/collections/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation<Collection, Error, CreateCollectionPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<Collection>(
        '/api/v1/collections',
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    Collection,
    Error,
    { id: string; payload: UpdateCollectionPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.patch<Collection>(
        `/api/v1/collections/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', id] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      // Invalidate bookmarks as well because onDelete SetNull updates collectionId to null
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}
