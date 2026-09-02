import { useState } from "react";
import "../styles/filter.css";
import { Search } from "lucide-react";

export default function SearchWithCategory({ categories, onSearch }) {
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        onSearch({
            name: search,
            type: category,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="search-form--resource"
        >
            <label>
                Search resources
            </label>

            <div className="search-container">
                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
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
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search..."
                />

                <button type="submit">
                    <Search size={18} />

                </button>
            </div>
        </form>
    );
}