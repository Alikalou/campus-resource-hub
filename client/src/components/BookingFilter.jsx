import { useState } from "react";
import "../styles/filter.css";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingFilter({ categories, onSearch }) {
    const [status, setStatus] = useState("");
    const [resourceName, setResourceName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        onSearch({
            resourceName,
            status,
            start,
            end,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="search-form--booking"
        >
            <label>Filter bookings</label>

            <div className="search-container">
                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option value="">All statuses</option>

                    {categories.map((category) => (
                        <option
                            key={category.value}
                            value={category.value}
                        >
                            {category.label}
                        </option>
                    ))}
                </select>

                <input className="search-input"
                    type="text"
                    value={resourceName}
                    onChange={(event) =>
                        setResourceName(event.target.value)
                    }
                    placeholder="Search booking by resource name..."
                />

                <DatePicker
                    selected={start}
                    onChange={(date) => setStart(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="start date..."
                />

                <DatePicker
                    selected={end}
                    onChange={(date) => setEnd(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="end date..."
                />

                <button type="submit">
                    <Search size={18} />
                </button>
            </div>
        </form>
    );
}