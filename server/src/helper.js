
export function generateId(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return 1;
    }

    const highestId = Math.max(
        ...items.map((item) => item.id)
    );

    return highestId + 1;
}