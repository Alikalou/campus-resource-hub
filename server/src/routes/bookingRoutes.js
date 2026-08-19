import express from "express";

import {
    getAllBookings,
    getMyBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking
} from "../controllers/bookingController.js"

//import { temporaryUser } from "../middleware/temporaryUser.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireRole.js";

const router = express.Router();

router.get("/all", authenticate, requireAdmin, getAllBookings);

// GET /bookings which is basically listing my bookings
router.get("/mine", authenticate, getMyBookings);

// POST /bookings
router.post("/", authenticate, createBooking);

// GET /bookings/:id
router.get("/:id", authenticate, getBookingById);

// PATCH /bookings/:id
router.patch("/:id", authenticate, requireAdmin, updateBookingStatus);

// POST /bookings/:id
router.post("/:id/cancel", authenticate, cancelBooking);


export default router;