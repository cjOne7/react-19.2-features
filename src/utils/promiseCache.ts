// Simple in-memory cache to create stable promises for use() + Suspense
const cache = new Map<string, Promise<unknown>>();

export function createCachedPromise<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    const promise = fetcher().catch((err: unknown) => {
      cache.delete(key); // Allow retry on failure
      throw err;
    });
    cache.set(key, promise);
  }
  return cache.get(key) as Promise<T>;
}

export function invalidateCache(...keys: string[]): void {
  keys.forEach((key) => cache.delete(key));
}
