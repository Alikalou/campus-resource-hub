import { useState } from "react";

export default function ResourceEditForm({
    resource,
    onUpdate,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        name: resource.name,
        type: resource.type,
        location: resource.location,
        capacity: resource.capacity ?? "",
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const resourceData = {
            ...formData,
            capacity: formData.capacity
                ? Number(formData.capacity)
                : null,
        };

        await onUpdate(
            resource.id,
            resourceData
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor={`name-${resource.id}`}>
                    Name
                </label>

                <input
                    id={`name-${resource.id}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor={`type-${resource.id}`}>
                    Type
                </label>

                <select
                    id={`type-${resource.id}`}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="room">
                        Room
                    </option>

                    <option value="equipment">
                        Equipment
                    </option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor={`location-${resource.id}`}>
                    Location
                </label>

                <input
                    id={`location-${resource.id}`}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor={`capacity-${resource.id}`}>
                    Capacity
                </label>

                <input
                    id={`capacity-${resource.id}`}
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button
                    className="primary-button"
                    type="submit"
                >
                    Save
                </button>

                <button
                    className="secondary-button"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}