import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getResources } from "../../api/resourcesApi";
import NavBar from "../../components/NavBar";
import Pagination from "../../components/Pagination";

import "./ResourcesPage.css";

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadResources() {
            try {
                const response = await getResources({ page, limit: 4 });
                setPagination(response.pagination);
                setResources(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadResources();
    }, [page]);

    if (isLoading) {
        return (
            <main className="resources-page">
                <p className="page-message">
                    Loading resources...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="resources-page">
                <p className="page-message error-message">
                    {error}
                </p>
            </main>
        );
    }

    if (resources.length === 0) {
        return (
            <main className="resources-page">
                <p className="page-message">
                    No resources found.
                </p>
            </main>
        );
    }

    return (
        <>
            <NavBar />
            <main className="resources-page">
                <section className="resources-header">
                    <p className="page-label">
                        Campus Resources
                    </p>

                    <h1>Find a resource</h1>

                    <p>
                        Browse available rooms and equipment
                        and choose the resource you want to book.
                    </p>
                </section>

                <section className="resources-grid">
                    {resources.map((resource) => (
                        <article
                            key={resource.id}
                            className="resource-card"
                        >
                            <div className="resource-card-header">
                                <span className="resource-type">
                                    {resource.type}
                                </span>

                                <h2 className="resource-card-header">{resource.name}</h2>
                            </div>

                            <div className="resource-details">
                                <div>
                                    <span className="detail-label">
                                        Location
                                    </span>

                                    <p>{resource.location}</p>
                                </div>

                                {resource.capacity && (
                                    <div>
                                        <span className="detail-label">
                                            Capacity
                                        </span>

                                        <p>
                                            {resource.capacity} people
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Link
                                to={`/resources/${resource.id}`}
                                className="resource-link"
                            >
                                View resource
                                <span aria-hidden="true">→</span>
                            </Link>
                        </article>
                    ))}
                </section>
                {pagination && (
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </main>

        </>
    );
}