import React, {
  createContext,
  type ReactElement,
  type ReactNode,
  use, // ← use() with Context — not just Promises!
  useOptimistic,
  useState,
  useTransition,
} from "react";
import type { User } from "@/types";

interface UsersContextValue {
  users: User[];
  optimisticUsers: User[];
  isPending: boolean;
  addOptimisticUser: (user: User) => void;
  removeOptimisticUser: (id: number) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  startTransition: (fn: () => void) => void;
}

const UsersContext = createContext<UsersContextValue | null>(null);

// Custom hook — throws descriptively if used outside provider
export function useUsersContext(): UsersContextValue {
  const context = use<UsersContextValue | null>(UsersContext); // use() reads Context (not just Promises)
  if (!context) throw new Error("useUsersContext must be used within <UsersProvider>");
  return context;
}

interface UsersProviderProps {
  initialUsers: User[];
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ initialUsers, children }): ReactElement => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  // useOptimistic: local optimistic mirror of users for instant UI feedback
  const [optimisticUsers, applyOptimistic] = useOptimistic<
    User[],
    { type: "add"; user: User } | { type: "remove"; id: number }
  >(users, (currentUsers, action) => {
    if (action.type === "add") return [...currentUsers, action.user];
    return currentUsers.filter((userItem) => userItem.id !== action.id);
  });

  const addOptimisticUser = (user: User): void => applyOptimistic({ type: "add", user });
  const removeOptimisticUser = (id: number): void => applyOptimistic({ type: "remove", id });

  return (
    <UsersContext
      value={{ users, optimisticUsers, isPending, addOptimisticUser, removeOptimisticUser, setUsers, startTransition }}
    >
      {children}
    </UsersContext>
  );
};
