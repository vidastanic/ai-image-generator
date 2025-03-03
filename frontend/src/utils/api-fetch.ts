import {isTokenExpired} from "./auth.ts";

export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        throw new Error("Login Expired");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Login Expired");
    }

    return response;
}
