import { useEffect, useState } from "react";

import {
    createResource,
    updateResource,
    getResourcesForAdmin,
} from "../../api/resourcesApi";

import "./AdminResourcesPage.css";
import "../../styles/buttons.css";
import "../../styles/forms.css";

import NavBar from "../../components/NavBar";
import ResourceCreateForm from "../../components/ResourceCreateForm";
import ResourceCard from "../../components/ResourceCard";

export default function AdminResourcesPage() {
    const [resources, setResources] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadResources() {
            try {
                const data = await getResourcesForAdmin();
                setResources(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadResources();
    }, []);

    function handleEdit(resource) {
        setEditingId(resource.id);
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function handleCreate(resourceData) {
        setError("");

        try {
            const newResource =
                await createResource(resourceData);

            setResources((currentResources) => [
                ...currentResources,
                newResource,
            ]);

            setShowCreateForm(false);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function handleUpdate(resourceId, resourceData) {
        setError("");

        try {
            const updatedResource =
                await updateResource(
                    resourceId,
                    resourceData
                );

            setResources((currentResources) =>
                currentResources.map((resource) =>
                    resource.id === resourceId
                        ? updatedResource
                        : resource
                )
            );

            setEditingId(null);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    if (isLoading) {
        return <p>Loading resources...</p>;
    }

    return (
        <>
            <NavBar />

            <main className="admin-resources-page">
                <header className="admin-resources-header">
                    <h1>Admin Resources</h1>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                            setShowCreateForm(
                                (current) => !current
                            )
                        }
                    >
                        {showCreateForm
                            ? "Close Form"
                            : "Create Resource"}
                    </button>
                </header>

                {error && (
                    <p role="alert">{error}</p>
                )}

                {showCreateForm && (
                    <ResourceCreateForm
                        onCreate={handleCreate}
                    />
                )}

                <section className="resources-section">
                    <h2>Resources</h2>

                    {resources.length === 0 ? (
                        <p>No resources found.</p>
                    ) : (
                        resources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                isEditing={
                                    editingId === resource.id
                                }
                                onEdit={handleEdit}
                                onCancelEdit={cancelEdit}
                                onUpdate={handleUpdate}
                            />
                        ))
                    )}
                </section>
            </main>
        </>
    );
}