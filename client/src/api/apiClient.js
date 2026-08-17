const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function apiRequest(path, options = {}) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_BASE_URL}${path}`,
            {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`
                    }),
                    ...options.headers,
                },
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "/login";

            throw new Error("Your session has expired, please login again");

        }

        const body = await response.json();

        if (!response.ok) {
            throw new Error(
                body.error?.message ?? "Something went wrong."
            );
        }

        return body.data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "Unable to connect to the server. Please try again later."
            );
        }

        throw error;
    }
}