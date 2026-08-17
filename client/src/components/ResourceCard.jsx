import ResourceEditForm from "./ResourceEditForm";


export default function ResourceCard({
    resource,
    isEditing,
    onEdit,
    onCancelEdit,
    onUpdate,
}) {
    return (
        <article className="resource-card">
            {isEditing ? (
                <ResourceEditForm
                    resource={resource}
                    onUpdate={onUpdate}
                    onCancel={onCancelEdit}
                />
            ) : (
                <>
                    <h3>{resource.name}</h3>

                    <div className="resource-details">
                        <p>
                            <span className="resource-label">
                                Type:
                            </span>{" "}
                            {resource.type}
                        </p>

                        <p>
                            <span className="resource-label">
                                Location:
                            </span>{" "}
                            {resource.location}
                        </p>

                        {resource.capacity != null && (
                            <p>
                                <span className="resource-label">
                                    Capacity:
                                </span>{" "}
                                {resource.capacity}
                            </p>
                        )}
                    </div>

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() => onEdit(resource)}
                    >
                        Edit
                    </button>
                </>
            )}
        </article>
    );
}