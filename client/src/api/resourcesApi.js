import { apiRequest } from "./apiClient";

export function getResources() {
    return apiRequest("/resources");
}

export function getResourceById(id) {
    return apiRequest(`/resources/${id}`);
}