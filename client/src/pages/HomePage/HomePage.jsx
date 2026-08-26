import { Link } from "react-router";
import { useState } from "react";

import "./HomePage.css";
import NavBar from "../../components/NavBar";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] =
        useState(
            Boolean(localStorage.getItem("token"))
        );
    const storedUser = localStorage.getItem("user");

    const user =
        storedUser && storedUser !== "undefined"
            ? JSON.parse(storedUser)
            : null;

    const isAdmin = (isAuthenticated && user?.role === "admin")

    return (
        <>
            <NavBar
                onLogout={() =>
                    setIsAuthenticated(false)
                }
            />
            <main className="home-page">
                <section className="hero">
                    <p className="hero-label">
                        Campus Resource Hub
                    </p>

                    <h1>
                        Book campus resources
                        quickly and easily.
                    </h1>

                    <p className="hero-description">
                        Browse available rooms and equipment,
                        submit booking requests, and keep track
                        of your bookings in one place.
                    </p>


                </section>

                <section className="features">
                    <Link
                        to="/resources"
                        className="feature-card-link"
                    >
                        <article className="feature-card">
                            <h2>Browse Resources</h2>

                            <p>
                                View rooms and equipment available
                                across the campus.
                            </p>
                        </article>
                    </Link>

                    <Link
                        to={
                            isAuthenticated
                                ? "/bookings/mine"
                                : "/login"
                        }
                        className="feature-card-link"
                    >
                        <article className="feature-card">
                            <h2>Track Your Requests</h2>

                            <p>
                                View your bookings and follow their
                                approval status.
                            </p>
                        </article>
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="feature-card-link"
                        >
                            <article className="feature-card">
                                <h2>Administration</h2>

                                <p>
                                    Review booking requests and manage
                                    campus resources.
                                </p>
                            </article>
                        </Link>
                    )}

                </section>

                {!isAuthenticated && (
                    <section className="account-section">
                        <h2>Ready to get started?</h2>

                        <p>
                            Sign in to manage your bookings or create
                            an account if you are new.
                        </p>

                        <div className="account-actions">
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </div>
                    </section>
                )}
            </main>

        </>
    );
}