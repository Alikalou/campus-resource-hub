import express from "express";

import {
    getBookings,
    getBookingById,
    createBooking
} from "../controllers/bookingController.js"

import { temporaryUser } from "../middleware/temporaryUser.js";

const router = express.Router();

// POST /bookings
router.post("/", temporaryUser, createBooking);

// GET /bookings
router.get("/", temporaryUser, getBookings);

// GET /bookings/:id
router.get("/:id", getBookingById);

export default router;