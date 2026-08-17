import {
    Link,
    useNavigate
} from "react-router"

import "../styles/NavBar.css";
import "../styles/buttons.css";

export default function NavBar({ onLogout }) {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    const isAuthenticated = Boolean(token);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        onLogout?.();

        navigate("/");
    }


    return (
        <header className="navbar">
            <Link
                to="/"
                className="navbar-brand"
            >
                Campus Resource Hub
            </Link>

            <nav className="navbar-links">
                <Link to="/resources">
                    Resources
                </Link>

                {isAuthenticated && (
                    <Link to="/bookings/mine">
                        My Bookings
                    </Link>
                )}
            </nav>

            <div className="navbar-account">
                {isAuthenticated ? (
                    <>
                        <span className="account-name">
                            {user?.name}
                            {user?.email && (
                                <>
                                    {" "}
                                    ({user.email})
                                </>
                            )}
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="secondary-button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );

}