import { apiClient } from "./client";
import type { Todo } from "@/types";

export const todosApi = {
  getByUser: (userId: number) => apiClient.get<Todo[]>(`/todos?userId=${userId}&_limit=15`),
  create: (todo: Omit<Todo, "id">) => apiClient.post<Todo>("/todos", todo),
  toggle: (id: number, completed: boolean) => apiClient.patch<Todo>(`/todos/${id}`, { completed }),
  delete: (id: number) => apiClient.delete<Record<string, never>>(`/todos/${id}`),
};
