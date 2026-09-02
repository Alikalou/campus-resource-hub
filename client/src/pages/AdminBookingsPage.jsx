import { useEffect, useState } from "react";

import {
    getAllBookings,
    updateBookingStatus,
} from "../api/bookingsApi";

import AdminBookingCard from "../components/AdminBookingCard";
import BookingFilter from "../components/BookingFilter";

import Pagination from "../components/Pagination";

import "../styles/buttons.css"
import "../styles/BookingCard.css"

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        resourceName: "",
        status: "",
        start: "",
        end: ""
    });

    const statusTypes = [
        { label: "Pending", value: "pending", },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
    ];

    useEffect(() => {
        async function loadBookings() {
            try {
                const response = await getAllBookings({ page, limit: 4, ...filters });
                setBookings(response.data);
                setPagination(response.pagination);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadBookings();
    }, [page, filters, bookings]);

    function handleFilterChange(newFilters) {
        setFilters(newFilters);
        setPage(1);
    }

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

            <main className="page-container">
                <h1 className="page-header">Admin Bookings</h1>
                {error && (
                    <p role="alert" className="alert-error">{error}</p>
                )}
                <section className="filter-section">
                    <BookingFilter
                        categories={statusTypes}
                        onSearch={handleFilterChange}
                    />

                </section>

                <section className="content-section">
                    <h2>Bookings</h2>
                    {bookings.length === 0 ? (
                        <p className="empty-state">No bookings found.</p>
                    ) : (
                        <div className="card-list">
                            {bookings.map((booking) => (
                                <AdminBookingCard key={booking.id}
                                    booking={booking}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </section>
                {pagination && (
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </main >
        </>
    );
}