import { apiRequest } from "./apiClient";

export function getAllBookings({ page, limit, resourceName, status, start, end }) {
    const params = {
        page,
        limit,
        ...(resourceName && { resourceName }),
        ...(status && { status }),
        ...(start && { start }),
        ...(end && { end })
    };
    return apiRequest("/bookings/all", { params });
}


export function getMyBookings({ page, limit, resourceName, status, start, end }) {
    const params = {
        page,
        limit,
        ...(resourceName && { resourceName }),
        ...(status && { status }),
        ...(start && { start }),
        ...(end && { end })
    };
    return apiRequest("/bookings/mine", { params });
}

export function getBookingById(bookingId) {
    return apiRequest(`/bookings/${bookingId}`);
}

export function createBooking(bookingData) {
    return apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
    });
}

export function updateBookingStatus(bookingId, status) {
    return apiRequest(`/bookings/${bookingId}`, {
        method: "PATCH",
        body: JSON.stringify({
            status,
        }),
    });
}

export function cancelBooking(bookingId) {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
        method: "POST",
    });
}