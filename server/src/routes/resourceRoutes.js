import express from "express";
import {
    getResources,
    getResourceById,
    createResource,
    updateResource,
} from "../controllers/resourceController.js"

const router = express.Router();

// GET /resources
router.get("/", getResources);

// POST /resources
router.post("/", createResource);

// GET /resources/:id
router.get("/:id", getResourceById);

// PATCH /resources/:id
router.patch("/:id", updateResource);

export default router;