import "server-only";

export class WordPressError extends Error {
  constructor(message: string, public readonly status = 502, cause?: unknown) {
    super(message, { cause });
  }
}

export function wordpressUrl(path: string, params?: URLSearchParams) {
  const base = process.env.NEXT_BASE_URL;
  if (!base) throw new WordPressError("WordPress is not configured", 503);
  return `${base.replace(/\/$/, "")}/${path}${params?.size ? `?${params}` : ""}`;
}

// The enclosing `use cache` function owns caching. Never layer a second fetch
// cache underneath it, which could survive tag invalidation.
const inFlight = new Map<string, Promise<Response>>();

export async function fetchWordPress(url: string): Promise<Response> {
  let pending = inFlight.get(url);
  if (!pending) {
    pending = requestWordPress(url).finally(() => inFlight.delete(url));
    inFlight.set(url, pending);
  }
  // Each consumer owns its response body; only concurrent work is shared.
  return (await pending).clone();
}

async function requestWordPress(url: string): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (response.ok) return response;
      if ((response.status >= 500 || response.status === 429) && attempt === 0) {
        await response.body?.cancel();
        // Bound Retry-After so one read cannot hold a server worker indefinitely.
        const retry = Number(response.headers.get("retry-after"));
        await new Promise((resolve) => setTimeout(resolve, Math.min(1000, Math.max(250, Number.isFinite(retry) ? retry * 1000 : 250))));
        continue;
      }
      throw new WordPressError("WordPress could not complete the request", response.status);
    } catch (error) {
      if (error instanceof WordPressError) throw error;
      if (attempt === 1) throw new WordPressError("WordPress request timed out or is unavailable", 504, error);
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  throw new WordPressError("WordPress is unavailable");
}

export async function wordpressJson<T>(url: string): Promise<T> {
  const response = await fetchWordPress(url);
  return response.json() as Promise<T>;
}
