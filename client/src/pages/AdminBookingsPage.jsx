import { useEffect, useState } from "react";

import {
    getAllBookings,
    updateBookingStatus,
} from "../api/bookingsApi";

import NavBar from "../components/NavBar";

import AdminBookingCard from "../components/AdminBookingCard";

import "../styles/global.css";
import Pagination from "../components/Pagination";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBookings() {
            try {
                const response = await getAllBookings({ page, limit: 5 });
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

    async function handleStatusChange(
        bookingId,
        newStatus
    ) {
        setError("");
        try {
            const updatedBooking =
                await updateBookingStatus(
                    bookingId,
                    newStatus
                );

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === bookingId
                        ? updatedBooking
                        : booking
                )
            );
        } catch (error) {
            setError(error.message);
        }
    }

    if (isLoading) {
        return <p>Loading bookings...</p>;
    }

    return (
        <>
            <NavBar />
            <main className="collection-page">
                <header className="admin-bookings-header">
                    <h1>Admin Bookings</h1>
                </header>
                {error && (
                    <p role="alert">{error}</p>
                )}
                <section className="bookings-section">
                    <h2>Bookings</h2>
                    {bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        bookings.map((booking) => (
                            <AdminBookingCard key={booking.id}
                                booking={booking}
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    )}
                </section>
                {pagination && (
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </main>
        </>
    );
}