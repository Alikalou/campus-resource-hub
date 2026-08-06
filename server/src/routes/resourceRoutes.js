import express from "express";
import {
    getResources,
    getResourceById,
    createResource,
    updateResource,
} from "../controllers/resourceController.js"

import { requireAdmin } from "../middleware/requireRole.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /resources
router.get("/", getResources);

// POST /resources
router.post("/", authenticate, requireAdmin, createResource);

// GET /resources/:id
router.get("/:id", getResourceById);

// PATCH /resources/:id
router.patch("/:id", authenticate, requireAdmin, updateResource);

export default router;