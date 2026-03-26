import React, {
  createContext,
  use, // ← use() with Context — not just Promises!
  useState,
  useTransition,
  useOptimistic,
  type ReactNode,
} from "react";
import type { User } from "@/types";

interface UsersContextValue {
  users: User[];
  optimisticUsers: User[];
  isPending: boolean;
  addOptimisticUser: (u: User) => void;
  removeOptimisticUser: (id: number) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  startTransition: (fn: () => void) => void;
}

const UsersContext = createContext<UsersContextValue | null>(null);

// Custom hook — throws descriptively if used outside provider
export function useUsersContext(): UsersContextValue {
  const ctx = use(UsersContext); // use() reads Context (not just Promises)
  if (!ctx) throw new Error("useUsersContext must be used within <UsersProvider>");
  return ctx;
}

interface Props {
  initialUsers: User[];
  children: ReactNode;
}

export function UsersProvider({ initialUsers, children }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  // useOptimistic: local optimistic mirror of users for instant UI feedback
  const [optimisticUsers, applyOptimistic] = useOptimistic(
    users,
    (current: User[], action: { type: "add"; user: User } | { type: "remove"; id: number }) => {
      if (action.type === "add") return [...current, action.user];
      return current.filter((u) => u.id !== action.id);
    },
  );

  const addOptimisticUser = (user: User): void => applyOptimistic({ type: "add", user });

  const removeOptimisticUser = (id: number): void => applyOptimistic({ type: "remove", id });

  return (
    <UsersContext
      value={{ users, optimisticUsers, isPending, addOptimisticUser, removeOptimisticUser, setUsers, startTransition }}
    >
      {children}
    </UsersContext>
  );
}
