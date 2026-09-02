import { apiRequest } from "./apiClient";

export function getResources({ page, limit, name, type }) {
    const params = {
        page,
        limit,
        ...(name && { name }),
        ...(type && { type }),
    };

    return apiRequest("/resources", { params });
}

export function getResourceById(id) {
    return apiRequest(`/resources/${id}`);
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