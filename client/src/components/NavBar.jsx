import {
    Link,
    useNavigate,
    useLocation
} from "react-router"

import "../styles/NavBar.css";
import "../styles/buttons.css";

const NAV_LINKS = [
    {
        label: "Home",
        path: "/",
    },
    {
        label: "Resources",
        path: "/resources",
    },
    {
        label: "My Bookings",
        path: "/bookings/mine",
        requiresAuth: true,
    },
];

export default function NavBar({ onLogout }) {
    const location = useLocation();

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    const isAuthenticated = Boolean(token);

    const visibleLinks = NAV_LINKS.filter((link) => {
        if (link.requiresAuth && !isAuthenticated) {
            return false;
        }

        if (link.path === location.pathname) {
            return false;
        }
        return true;
    });

    function handleLogout() {
        const confirmed = window.confirm(
            "Are you sure you want to sign out?");
        if (!confirmed) {
            return;
        }

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
                {visibleLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                    >
                        {link.label}
                    </Link>
                ))}
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