import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router";

import { getResourceById } from "../../api/resourcesApi";
import { createBooking } from "../../api/bookingsApi";

import "./ResourceDetailsPage.css"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../../styles/common.css";

import { formatDateTimeLocal } from "../../utils/dateUtils.js";

export default function ResourceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resource, setResource] = useState(null);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] =
        useState("");

    useEffect(() => {
        async function loadResource() {
            try {
                const data = await getResourceById(id);

                setResource(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadResource();
    }, [id]);

    async function handleBookingSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setError("");
        setSuccessMessage("");

        if (!startTime || !endTime) {
            setError(
                "Start time and end time are required."
            );
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            setError(
                "End time must be after start time."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await createBooking({
                resource_id: Number(id),
                start_time: formatDateTimeLocal(startTime),
                end_time: formatDateTimeLocal(endTime),
            });

            setSuccessMessage(
                "Booking request created successfully."
            );

            setStartTime("");
            setEndTime("");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }
    if (isLoading) {
        return <p>Loading resource...</p>;
    }

    if (!resource) {
        return <p>Resource not found.</p>;
    }

    return (
        <>

            <main className="page-container">
                <section className="resource-details-card">
                    <div className="resource-details">
                        <p>
                            <span className="resource-label">
                                Resource Name:
                            </span>{" "}
                            {resource.data.name}
                        </p>

                        <p>
                            <span className="resource-label">
                                Type:
                            </span>{" "}
                            {resource.data.type}
                        </p>

                        <p>
                            <span className="resource-label">
                                Location:
                            </span>{" "}
                            {resource.data.location}
                        </p>

                        {resource.capacity != null && (
                            <p>
                                <span className="resource-label">
                                    Capacity:
                                </span>{" "}
                                {resource.capacity}
                            </p>
                        )}
                    </div>
                </section>

                <section className="booking-request-card">
                    <h2>Request Booking</h2>

                    <p className="booking-request-description">
                        Select a start and end time for your booking.
                    </p>

                    {error && (
                        <p
                            className="booking-message booking-message--error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {successMessage && (
                        <p className="booking-message booking-message--success">
                            {successMessage}
                        </p>
                    )}

                    <form onSubmit={handleBookingSubmit}>
                        <div className="form-field">
                            <label htmlFor="startTime">
                                Start Time
                            </label>

                            <DatePicker
                                selected={startTime}
                                onChange={(date) => setStartTime(date)}
                                showTimeSelect
                                dateFormat="MMMM d, yyyy h:mm aa"
                                fixedHeight
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="endTime">
                                End Time
                            </label>

                            <DatePicker
                                selected={endTime}
                                onChange={(date) => setEndTime(date)}
                                showTimeSelect
                                dateFormat="MMMM d, yyyy h:mm aa"
                                fixedHeight
                            />
                        </div>

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Request Booking"}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}