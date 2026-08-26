import { apiRequest } from "./apiClient";

export function getAllBookings(params) {
    return apiRequest("/bookings/all", { params });
}


export function getMyBookings(params) {
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