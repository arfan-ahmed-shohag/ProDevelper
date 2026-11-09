type Pending = { promise: Promise<unknown>; controller: AbortController; users: number };
const pending = new Map<string, Pending>();

export async function getJson<T>(url: string, signal: AbortSignal, errorMessage = "The requested data is temporarily unavailable. Please try again."): Promise<T> {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  let entry = pending.get(url);
  if (!entry) {
    const controller = new AbortController();
    const created: Pending = { controller, users: 0, promise: Promise.resolve() };
    created.promise = fetch(url, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(35000)]),
      cache: "no-store", headers: { Accept: "application/json" },
    }).then(async response => {
      if (!response.ok) throw new Error(errorMessage);
      return response.json();
    }).finally(() => { if (pending.get(url) === created) pending.delete(url); });
    entry = created;
    pending.set(url, entry);
  }
  const shared = entry;
  shared.users++;
  return new Promise<T>((resolve, reject) => {
    let done = false;
    const release = () => {
      if (done) return false;
      done = true;
      signal.removeEventListener("abort", abort);
      shared.users--;
      if (shared.users === 0 && pending.get(url) === shared) {
        pending.delete(url);
        shared.controller.abort();
      }
      return true;
    };
    const abort = () => { if (release()) reject(new DOMException("Aborted", "AbortError")); };
    signal.addEventListener("abort", abort, { once: true });
    shared.promise.then(
      data => { if (release()) resolve(data as T); },
      error => { if (release()) reject(error); },
    );
  });
}

