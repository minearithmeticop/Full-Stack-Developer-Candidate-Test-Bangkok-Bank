import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import {
  Bookmark,
  CreateBookmarkPayload,
  UpdateBookmarkPayload,
} from '../types';

export function useGetBookmarks(collectionId?: string, search?: string) {
  return useQuery<Bookmark[]>({
    queryKey: ['bookmarks', { collectionId, search }],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (collectionId) {
        params.collectionId = collectionId;
      }
      if (search) {
        params.search = search;
      }
      const response = await apiClient.get<Bookmark[]>('/api/v1/bookmarks', {
        params,
      });
      return response.data;
    },
  });
}

export function useGetBookmark(id?: string) {
  return useQuery<Bookmark>({
    queryKey: ['bookmarks', id],
    queryFn: async () => {
      const response = await apiClient.get<Bookmark>(`/api/v1/bookmarks/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation<Bookmark, Error, CreateBookmarkPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<Bookmark>(
        '/api/v1/bookmarks',
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation<
    Bookmark,
    Error,
    { id: string; payload: UpdateBookmarkPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.patch<Bookmark>(
        `/api/v1/bookmarks/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks', id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/bookmarks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}
