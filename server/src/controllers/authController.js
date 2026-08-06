import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { registerUser, loginUser } from "../services/authService.js";
import { validateRegister } from "../validators/auth/registerValidator.js";
import { validateLogin } from "../validators/auth/loginValidator.js"

export async function register(req, res, next) {
    try {
        const validation = validateRegister(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const user = await registerUser(validation.value);

        return res.status(201).json({
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const validation = validateLogin(req.body);

        if (!validation.isValid) {
            return next(
                new AppError(
                    validation.message,
                    validation.statusCode,
                    validation.errorCode
                )
            );
        }

        const result = await loginUser(validation.value);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
}