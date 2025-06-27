import express from "express";
const router = express.Router();

const {
  addLocation,
  getLocations,
  deleteLocation,
} = require("../controllers/locations");

// POST /api/locations - Add a new location
router.post("/", addLocation);

// GET /api/locations - Get all locations
router.get("/", getLocations);

// DELETE /api/locations/:id - Delete a location by ID
router.delete("/:id", deleteLocation);

export default router;
