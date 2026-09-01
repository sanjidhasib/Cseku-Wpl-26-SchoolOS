const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AuthUser {
    id: string;
    email: string;
    role: "admin" | "teacher" | "student" | "guardian";
}

export interface AuthState {
    token: string;
    user: AuthUser;
    profile: Record<string, unknown> | null;
}

const TOKEN_KEY = "schoolos_token";
const USER_KEY = "schoolos_user";
const PROFILE_KEY = "schoolos_profile";

export function setAuth(state: AuthState) {
    localStorage.setItem(TOKEN_KEY, state.token);
    localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function getProfile(): Record<string, unknown> | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function hasRole(role: string): boolean {
    const user = getUser();
    return user?.role === role;
}

export function dashboardPath(role: string): string {
    switch (role) {
        case "admin": return "/admin";
        case "teacher": return "/teacher";
        case "student": return "/student";
        case "guardian": return "/guardian";
        default: return "/";
    }
}

// API call helpers
export async function apiLogin(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data as AuthState;
}

export async function apiRegister(payload: Record<string, unknown>) {
    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data as AuthState;
}

export function authHeaders(): { Authorization: string; "Content-Type": string } {
    return {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
    };
}
