import { useState } from "react";

const emptyForm = {
    name: "",
    type: "room",
    location: "",
    capacity: "",
};

export default function ResourceCreateForm({ onCreate }) {
    const [formData, setFormData] = useState(emptyForm);

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

        await onCreate(resourceData);

        setFormData(emptyForm);
    }

    return (
        <form
            className="resource-form"
            onSubmit={handleSubmit}
        >
            <div className="form-field">
                <label htmlFor="create-name">
                    Name
                </label>

                <input
                    id="create-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="create-type">
                    Type
                </label>

                <select
                    id="create-type"
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
                <label htmlFor="create-location">
                    Location
                </label>

                <input
                    id="create-location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="create-capacity">
                    Capacity
                </label>

                <input
                    id="create-capacity"
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
                    Create Resource
                </button>
            </div>
        </form>
    );
}