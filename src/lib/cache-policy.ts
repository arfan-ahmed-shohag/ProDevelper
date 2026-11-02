export const oneMonthCachePolicy = {
  stale: 2592000,
  revalidate: 60,
  expire: 2678400,
} as const;
