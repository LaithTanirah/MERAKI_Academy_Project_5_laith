import { Request, Response } from "express";
import pool from "../models/connectDB";

// Add a location
const addLocation = (req: Request, res: Response): void => {
  const { location_name, latitude, longitude, userId } = req.body;

  if (!latitude || !longitude) {
    res.status(400).json({
      success: false,
      message: "Latitude and Longitude are required",
    });
    return;
  }

  const query = `
    INSERT INTO locations (location_name, location, "UserId")
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
    RETURNING *
  `;

  pool
    .query(query, [location_name, longitude, latitude, userId])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Location added successfully",
        result: result.rows[0],
      });
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

// Get all locations
const getLocations = (req: Request, res: Response): void => {
  const { userId } = req.query;
  console.log(userId);

  const query = `
SELECT
  location_id,
  location_name,
  "UserId",
  ST_Y(location::geometry) AS latitude,
  ST_X(location::geometry) AS longitude
FROM locations
WHERE "UserId" = ${userId}
ORDER BY location_id DESC;
  `;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All locations retrieved successfully",
        result: result.rows,
      });
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

// Delete a location by location_id
const deleteLocation = (req: Request, res: Response): void => {
  const { id } = req.params;

  const query = `DELETE FROM locations WHERE location_id = $1`;

  pool
    .query(query, [id])
    .then(() => {
      res.status(200).json({
        success: true,
        message: `Location with id ${id} deleted successfully`,
      });
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

module.exports = {
  addLocation,
  getLocations,
  deleteLocation,
};
