import { apiRequest } from "./apiClient";

export function getResources() {
    return apiRequest("/resources");
}

export function getResourceById(id) {
    return apiRequest(`/resources/${id}`);
}

export function getResourcesForAdmin() {
    return apiRequest("/resources/admin");
}

export function createResource(resourceData) {
    return apiRequest("/resources", {
        method: "POST",
        body: JSON.stringify(resourceData),
    });
}

export function updateResource(
    resourceId,
    resourceData
) {
    return apiRequest(`/resources/${resourceId}`, {
        method: "PATCH",
        body: JSON.stringify(resourceData),
    });
}