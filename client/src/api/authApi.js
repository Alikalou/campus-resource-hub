import { apiRequest } from "./apiClient";


export function register(userData) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export function login(credintials) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credintials),
    });
}