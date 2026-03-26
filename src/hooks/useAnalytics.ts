import { useEffect, useEffectEvent } from "react";

interface AnalyticsEvent {
  page: string;
  userId?: number;
  timestamp: number;
}

// useEffectEvent: stable event handler that always captures latest props/state
// without being a reactive dependency — ideal for logging/analytics
export function usePageAnalytics(pageName: string, userId?: number): void {
  const logEvent = useEffectEvent((event: AnalyticsEvent) => {
    // In a real app this would call an analytics service
    console.info("[Analytics]", event);
  });

  useEffect(() => {
    logEvent({ page: pageName, userId, timestamp: Date.now() });
  }, [pageName, userId]); // ✅ logEvent intentionally excluded — useEffectEvent ensures freshness
}
