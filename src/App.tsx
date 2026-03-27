import React, { type ReactElement, useState, useTransition, Activity, Suspense } from "react";
import { AppLayout, ErrorBoundary, SkeletonCard } from "@/components";
import { DashboardPage, PostsPage, TodosPage, UsersPage } from "@/features";
import type { TabId } from "@/types";

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  dashboard: DashboardPage,
  posts: PostsPage,
  users: UsersPage,
  todos: TodosPage,
};

// ┌─ useTransition: tab navigation never blocks the current UI ──────┐
// │  Activity:     hidden tabs preserve their state (scroll, data)   │
// └──────────────────────────────────────────────────────────────────┘
export const App: React.FC = (): ReactElement => {
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
};

export default App;
