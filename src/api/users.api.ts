import { apiClient } from "./client";
import type { User } from "@/types";

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/users"),
  create: (user: Omit<User, "id">) => apiClient.post<User>("/users", user),
  delete: (id: number) => apiClient.delete<Record<string, never>>(`/users/${id}`),
};
