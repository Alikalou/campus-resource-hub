import { useEffect, useState } from "react";

import {
    getMyBookings,
    cancelBooking,
} from "../api/bookingsApi";

import BookingCard from "../components/BookingCard";
import NavBar from "../components/NavBar";
import Pagination from "../components/Pagination";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelError, setCancelError] = useState("");
    const [cancellingBookingId, setCancellingBookingId] = useState(null);

    useEffect(() => {
        async function loadBookings() {
            try {
                const response = await getMyBookings({ page, limit: 5 });

                setBookings(response.data);
                setPagination(response.pagination);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadBookings();
    }, [page]);

    async function handleCancelBooking(bookingId) {
        setCancelError("");
        setCancellingBookingId(bookingId);

        try {
            await cancelBooking(bookingId);

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === bookingId
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );
        } catch (error) {
            setCancelError(error.message);
        } finally {
            setCancellingBookingId(null);
        }
    }

    if (isLoading) {
        return (
            <main>
                <h1>My Bookings</h1>
                <p>Loading bookings...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h1>My Bookings</h1>
                <p role="alert">{error}</p>
            </main>
        );
    }

    const now = new Date();

    const upcomingBookings = bookings.filter(
        (booking) =>
            new Date(booking.start_time) >= now
    );

    const pastBookings = bookings.filter(
        (booking) =>
            new Date(booking.start_time) < now
    );

    return (
        <>
            <NavBar />
            <main>

                <h1>My Bookings</h1>

                {cancelError && (
                    <p role="alert">{cancelError}</p>
                )}

                <section>
                    <h2>Upcoming Bookings</h2>

                    {upcomingBookings.length === 0 ? (
                        <p>You have no upcoming bookings.</p>
                    ) : (
                        upcomingBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                isCancelling={
                                    cancellingBookingId === booking.id
                                }
                            />
                        ))
                    )}
                </section>

                <section>
                    <h2>Past Bookings</h2>

                    {pastBookings.length === 0 ? (
                        <p>You have no past bookings.</p>
                    ) : (
                        pastBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                            />
                        ))
                    )}
                </section>
                {pagination && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </main>
        </>
    );
}