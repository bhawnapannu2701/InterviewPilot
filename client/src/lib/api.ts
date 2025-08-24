const API_BASE = import.meta.env.VITE_API_BASE as string;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // include cookies (for auth/session)
  });

  if (!res.ok) {
    let err: any = {};
    try {
      err = await res.json();
    } catch {
      err = { error: res.statusText };
    }
    throw new Error(err.error || "API error");
  }

  return res.json() as Promise<T>;
}
