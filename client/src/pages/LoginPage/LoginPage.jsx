import { useState } from "react";

import {
    useLocation,
    useNavigate,
} from "react-router";

import { login } from "../../api/authApi";

import "../../styles/auth.css";
import "../../styles/buttons.css";


export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const data = await login(formData);

            //I'm saving JWS using the 2 statements below.
            localStorage.setItem(
                "token",
                data.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.data.user)
            );

            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>Sign In</h1>

                <p className="auth-subtitle">
                    Sign in to manage your campus bookings.
                </p>

                {location.state?.message && (
                    <p className="success-message">
                        {location.state.message}
                    </p>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <p
                            className="error-message"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>
            </section>
        </main>
    );
}

