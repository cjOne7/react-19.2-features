import React, { useState, useTransition, Activity, Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import type { TabId } from "@/types";
import { DashboardPage } from "@/features/dashboard/DashboardPage.tsx";
import { PostsPage } from "@/features/posts/PostsPage.tsx";
import { UsersPage } from "@/features/users/UsersPage.tsx";
import { TodosPage } from "@/features/todos/TodosPage.tsx";

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  dashboard: DashboardPage,
  posts: PostsPage,
  users: UsersPage,
  todos: TodosPage,
};

// ┌─ useTransition: tab navigation never blocks the current UI ──────┐
// │  Activity:     hidden tabs preserve their state (scroll, data)   │
// └──────────────────────────────────────────────────────────────────┘
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: TabId): void => {
    startTransition(() => setActiveTab(tab));
  };

  return (
    <AppLayout activeTab={activeTab} isPending={isPending} onTabChange={handleTabChange}>
      {(Object.entries(TAB_COMPONENTS) as [TabId, React.ComponentType][]).map(([tabId, TabComponent]) => (
        // Activity keeps each tab's component tree alive (state preserved)
        // when switching away — no re-fetch, no scroll-reset
        <Activity key={tabId} mode={activeTab === tabId ? "visible" : "hidden"}>
          <ErrorBoundary>
            <Suspense fallback={<SkeletonCard count={4} />}>
              <TabComponent />
            </Suspense>
          </ErrorBoundary>
        </Activity>
      ))}
    </AppLayout>
  );
}
