import MuiPagination from "@mui/material/Pagination";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    return (
        <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
        />
    );
}