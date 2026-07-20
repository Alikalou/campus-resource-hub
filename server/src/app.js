import express from "express";
import resourceRoutes from "./routes/resourceRoutes.js";
import { AppError } from "./errors/AppError.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ERROR_CODES } from "./errors/errorCodes.js";

const app = express();

app.use(express.json());


//Router mounting, which is a js express feature.
app.use("/resources", resourceRoutes);

app.use((req, res, next) => {
    return next(
        new AppError(
            `Route ${req.method} ${req.originalUrl} was not found`,
            404,
            ERROR_CODES.ROUTE_NOT_FOUND,
        )
    );
});

app.use(errorHandler);

export default app;