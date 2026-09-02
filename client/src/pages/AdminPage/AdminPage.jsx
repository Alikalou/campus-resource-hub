import { Link } from "react-router";

import NavBar from "../../components/NavBar";
import "./AdminPage.css";

export default function AdminPage() {
    return (
        <>


            <main className="admin-page">
                <section className="admin-header">
                    <p className="admin-label">
                        Administration
                    </p>

                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage campus resources and review
                        booking requests.
                    </p>
                </section>

                <section className="admin-actions">
                    <Link
                        to="/admin/bookings"
                        className="admin-card"
                    >
                        <h2>Booking Requests</h2>

                        <p>
                            Review pending bookings and
                            approve or reject requests.
                        </p>

                        <span>Manage bookings →</span>
                    </Link>

                    <Link
                        to="/admin/resources"
                        className="admin-card"
                    >
                        <h2>Resources</h2>

                        <p>
                            Create new campus resources and
                            update existing ones.
                        </p>

                        <span>Manage resources →</span>
                    </Link>
                </section>
            </main>
        </>
    );
}