import { LoginData, AuthResponse } from "../types/auth";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Invalid email or password.");
  }

  return res.json();
}
