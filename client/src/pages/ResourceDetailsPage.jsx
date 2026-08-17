import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router";

import { getResourceById } from "../api/resourcesApi";
import { createBooking } from "../api/bookingsApi";

export default function ResourceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resource, setResource] = useState(null);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

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
                start_time: startTime,
                end_time: endTime,
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
        <main>
            <h1>{resource.name}</h1>

            <p>
                Type: {resource.type}
            </p>

            <p>
                Location: {resource.location}
            </p>

            {resource.capacity != null && (
                <p>
                    Capacity: {resource.capacity}
                </p>
            )}

            <hr />

            <h2>Request Booking</h2>

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            {successMessage && (
                <p>
                    {successMessage}
                </p>
            )}

            <form onSubmit={handleBookingSubmit}>
                <div>
                    <label htmlFor="startTime">
                        Start Time
                    </label>

                    <input
                        id="startTime"
                        type="datetime-local"
                        value={startTime}
                        onChange={(event) =>
                            setStartTime(
                                event.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endTime">
                        End Time
                    </label>

                    <input
                        id="endTime"
                        type="datetime-local"
                        value={endTime}
                        onChange={(event) =>
                            setEndTime(
                                event.target.value
                            )
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Submitting..."
                        : "Request Booking"}
                </button>
            </form>
        </main>
    );
}