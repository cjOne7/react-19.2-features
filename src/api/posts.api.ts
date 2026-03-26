import { apiClient } from "./client";
import type { Comment, Post } from "@/types";

export const postsApi = {
  getAll: () => apiClient.get<Post[]>("/posts?_limit=20"),
  getById: (id: number) => apiClient.get<Post>(`/posts/${id}`),
  getComments: (postId: number) => apiClient.get<Comment[]>(`/posts/${postId}/comments`),
  create: (post: Omit<Post, "id">) => apiClient.post<Post>("/posts", post),
  delete: (id: number) => apiClient.delete<Record<string, never>>(`/posts/${id}`),
};
