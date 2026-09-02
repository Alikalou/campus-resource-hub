import "../styles/BookingCard.css";

export default function AdminBookingCard({
    booking,
    onStatusChange,
}) {
    return (
        <article className="booking-card booking-card--admin">

            <div className="booking-card__header">
                <h3>Booking #{booking.id}</h3>

                <span
                    className={`booking-status booking-status--${booking.status}`}
                >
                    {booking.status}
                </span>
            </div>


            <div className="booking-card__details">

                <div>
                    <span className="booking-card__label">
                        Resource
                    </span>

                    <span>
                        {booking.resource_name}
                    </span>
                </div>


                <div>
                    <span className="booking-card__label">
                        Start
                    </span>

                    <span>
                        {new Date(
                            booking.start_time
                        ).toLocaleString()}
                    </span>
                </div>


                <div>
                    <span className="booking-card__label">
                        End
                    </span>

                    <span>
                        {new Date(
                            booking.end_time
                        ).toLocaleString()}
                    </span>
                </div>

            </div>


            {booking.status === "pending" && (
                <div className="booking-card__actions">

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