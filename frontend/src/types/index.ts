export interface Collection {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  bookmarks?: Bookmark[];
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  notes?: string | null;
  collectionId?: string | null;
  collection?: Collection | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
}

export interface CreateBookmarkPayload {
  url: string;
  title: string;
  notes?: string;
  collectionId?: string | null;
}

export interface UpdateBookmarkPayload {
  url?: string;
  title?: string;
  notes?: string;
  collectionId?: string | null;
}
