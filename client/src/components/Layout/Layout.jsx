import { Outlet } from "react-router";
import NavBar from "../NavBar";

import "./Layout.css";

export default function Layout() {
    return (
        <div className="app-layout">

            <NavBar />

            <main className="page-container">
                <Outlet />
            </main>

        </div>
    );
}