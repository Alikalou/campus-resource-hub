export default function AdminBookingCard({
    booking,
    onStatusChange,
}) {
    return (
        <article className="booking-card">
            <h3>Booking #{booking.id}</h3>

            <div className="booking-details">
                <p>
                    <span className="booking-label">
                        Resource:
                    </span>{" "}
                    {booking.resource_name}
                </p>

                <p>
                    <span className="booking-label">
                        Start:
                    </span>{" "}
                    {new Date(
                        booking.start_time
                    ).toLocaleString()}
                </p>

                <p>
                    <span className="booking-label">
                        End:
                    </span>{" "}
                    {new Date(
                        booking.end_time
                    ).toLocaleString()}
                </p>

                <p>
                    <span className="booking-label">
                        Status:
                    </span>{" "}
                    {booking.status}
                </p>
            </div>

            {booking.status === "pending" && (
                <div className="booking-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            onStatusChange(
                                booking.id,
                                "approved"
                            )
                        }
                    >
                        Approve
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            onStatusChange(
                                booking.id,
                                "rejected"
                            )
                        }
                    >
                        Reject
                    </button>
                </div>
            )}
        </article>
    );
}