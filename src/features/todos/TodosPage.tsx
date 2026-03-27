import React, { type ReactElement, Suspense, use, useOptimistic, useState } from "react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { todosApi } from "@/api/todos.api";
import { usePageAnalytics } from "@/hooks/useAnalytics";
import { createCachedPromise } from "@/utils/promiseCache";
import type { Todo } from "@/types";
import { AddTodoForm } from "./AddTodoForm";
import { TodoItem } from "./TodoItem";

const CURRENT_USER_ID = 1;
const todosPromise = createCachedPromise<Todo[]>(`todos/user-${CURRENT_USER_ID}`, () =>
  todosApi.getByUser(CURRENT_USER_ID),
);

const TodosPageInner: React.FC = (): ReactElement => {
  const initialTodos = use<Todo[]>(todosPromise);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // useOptimistic: mirror of todos with pending additions applied immediately
  const [optimisticTodos, addOptimisticTodo] = useOptimistic<Todo[], Todo>(
    todos,
    (currentTodos: Todo[], newTodo: Todo) => [...currentTodos, newTodo],
  );

  const handleAdd = async (title: string): Promise<void> => {
    const tempTodo: Todo = { id: Date.now(), userId: CURRENT_USER_ID, title, completed: false };
    addOptimisticTodo(tempTodo); // instant UI
    const createdTodo = await todosApi.create({ userId: CURRENT_USER_ID, title, completed: false });
    setTodos((previousTodos) => [...previousTodos, { ...createdTodo, id: tempTodo.id }]);
  };

  const handleToggle = async (id: number, completed: boolean): Promise<void> => {
    setTodos((previousTodos) =>
      previousTodos.map((todoItem) => (todoItem.id === id ? { ...todoItem, completed } : todoItem)),
    );
    await todosApi.toggle(id, completed);
  };

  const handleDelete = async (id: number): Promise<void> => {
    setTodos((previousTodos) => previousTodos.filter((todoItem) => todoItem.id !== id));
    await todosApi.delete(id);
  };

  const completedTodosCount = optimisticTodos.filter((todoItem) => todoItem.completed).length;
  const pendingTodosCount = optimisticTodos.length - completedTodosCount;

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={optimisticTodos.length ? (completedTodosCount / optimisticTodos.length) * 100 : 0}
        sx={{ mb: 2, height: 6, borderRadius: 3 }}
      />
      <Typography variant="caption" color="text.secondary" mb={2} display="block">
        {completedTodosCount} done · {pendingTodosCount} remaining
      </Typography>

      {/* AddTodoForm contains a <form> — FormSubmitButton inside uses useFormStatus */}
      <AddTodoForm onAdd={handleAdd} />

      <Stack spacing={1} mt={2}>
        {optimisticTodos.map((todoItem) => (
          <TodoItem key={todoItem.id} todo={todoItem} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </Stack>
    </>
  );
};

export const TodosPage: React.FC = (): ReactElement => {
  usePageAnalytics("todos");

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <Typography variant="h5">Todos</Typography>
        <FeatureBadge label="useOptimistic" color="warning" description="Todos appear before API confirms" />
        <FeatureBadge label="useFormStatus" color="secondary" description="Submit button reacts to form state" />
        <FeatureBadge label="useEffectEvent" color="info" description="Analytics hook — zero stale closure" />
        <FeatureBadge label="<Activity>" color="success" description="State preserved when switching tabs" />
      </Stack>
      <ErrorBoundary>
        <Suspense fallback={<SkeletonCard count={5} />}>
          <TodosPageInner />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
