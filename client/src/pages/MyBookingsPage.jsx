import { useEffect, useState } from "react";

import {
    getMyBookings,
    cancelBooking,
} from "../api/bookingsApi";

import BookingCard from "../components/BookingCard";
import Pagination from "../components/Pagination";
import BookingFilter from "../components/BookingFilter";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        resourceName: "",
        status: "",
        start: "",
        end: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelError, setCancelError] = useState("");
    const [cancellingBookingId, setCancellingBookingId] = useState(null);


    const statusTypes = [
        { label: "Pending", value: "pending", },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
    ];


    useEffect(() => {
        async function loadBookings() {
            try {
                const response = await getMyBookings({ page, limit: 4, ...filters });

                setBookings(response.data);
                setPagination(response.pagination);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadBookings();
    }, [page, filters]);

    function handleFilterChange(newFilters) {
        setFilters(newFilters);
        setPage(1);
    }

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


    return (
        <main className="page-container">

            <h1 className="page-header">My Bookings</h1>

            {cancelError && (
                <p className="alert-error" role="alert">
                    {cancelError}
                </p>
            )}

            <section className="filter-section">
                <BookingFilter
                    categories={statusTypes}
                    onSearch={handleFilterChange}
                />
            </section>

            <section className="content-section">

                {bookings.length === 0 ? (
                    <p className="empty-state">
                        You have no bookings.
                    </p>
                ) : (
                    <div className="card-list">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                isCancelling={
                                    cancellingBookingId === booking.id
                                }
                            />
                        ))}
                    </div>
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
    );
}