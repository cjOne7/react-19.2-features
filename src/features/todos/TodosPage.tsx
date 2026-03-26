import React, { use, useState, useOptimistic, Suspense } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { FeatureBadge } from "@/components/common/FeatureBadge";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { todosApi } from "@/api/todos.api";
import { createCachedPromise } from "@/utils/promiseCache";
import { usePageAnalytics } from "@/hooks/useAnalytics";
import type { Todo } from "@/types";

const CURRENT_USER_ID = 1;
const todosPromise = createCachedPromise(`todos/user-${CURRENT_USER_ID}`, () => todosApi.getByUser(CURRENT_USER_ID));

function TodosPageInner() {
  const initial = use(todosPromise);
  const [todos, setTodos] = useState<Todo[]>(initial);

  // useOptimistic: mirror of todos with pending additions applied immediately
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (current: Todo[], newTodo: Todo) => [
    ...current,
    newTodo,
  ]);

  const handleAdd = async (title: string): Promise<void> => {
    const temp: Todo = { id: Date.now(), userId: CURRENT_USER_ID, title, completed: false };
    addOptimisticTodo(temp); // instant UI
    const created = await todosApi.create({ userId: CURRENT_USER_ID, title, completed: false });
    setTodos((prev) => [...prev, { ...created, id: temp.id }]);
  };

  const handleToggle = async (id: number, completed: boolean): Promise<void> => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    await todosApi.toggle(id, completed);
  };

  const handleDelete = async (id: number): Promise<void> => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await todosApi.delete(id);
  };

  const done = optimisticTodos.filter((t) => t.completed).length;
  const pending = optimisticTodos.length - done;

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={optimisticTodos.length ? (done / optimisticTodos.length) * 100 : 0}
        sx={{ mb: 2, height: 6, borderRadius: 3 }}
      />
      <Typography variant="caption" color="text.secondary" mb={2} display="block">
        {done} done · {pending} remaining
      </Typography>

      {/* AddTodoForm contains a <form> — FormSubmitButton inside uses useFormStatus */}
      <AddTodoForm onAdd={handleAdd} />

      <Stack spacing={1} mt={2}>
        {optimisticTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </Stack>
    </>
  );
}

export function TodosPage(): React.ReactElement {
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
}
