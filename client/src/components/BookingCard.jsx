import "../styles/BookingCard.css";

export default function BookingCard({
    booking,
    onCancel,
    isCancelling,
}) {
    const canCancel = booking.status === "pending";

    return (
        <article className="booking-card booking-card--user">

            <div className="booking-card__header">
                <h3>{booking.resource_name}</h3>

                <span
                    className={`booking-status booking-status--${booking.status}`}
                >
                    {booking.status}
                </span>
            </div>


            <div className="booking-card__details">

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


            {onCancel && (
                <div className="booking-card__actions">

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onCancel(booking.id)}
                        disabled={!canCancel || isCancelling}
                    >
                        {isCancelling
                            ? "Cancelling..."
                            : "Cancel Booking"}
                    </button>

                </div>
            )}

        </article>
    );
}