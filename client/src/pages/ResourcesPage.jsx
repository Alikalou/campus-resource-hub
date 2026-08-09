import { useEffect, useState } from "react";

import { getResources } from "../api/resourcesApi";

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadResources() {
            try {
                const data =
                    await getResources();

                setResources(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadResources();
    }, []);

    if (isLoading) {
        return <p>Loading resources...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (resources.length === 0) {
        return <p>No resources found.</p>;
    }

    return (
        <main>
            <h1>Resources</h1>

            {resources.map((resource) => (
                <article key={resource.id}>
                    <h2>{resource.name}</h2>

                    <p>
                        Type: {resource.type}
                    </p>

                    <p>
                        Location:{" "}
                        {resource.location}
                    </p>
                </article>
            ))}
        </main>
    );
}