import { Request, Response } from "express";
import pool from "../models/connectDB";
import { promises } from "dns";

/**
 * Create a new role
 * POST /api/roles
 */
export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { permission } = req.body;

  if (!Array.isArray(permission)) {
    res.status(400).json({ error: "permission must be an array of strings" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO role (permission) VALUES ($1) RETURNING *`,
      [permission]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create role", details: err });
  }
};

/**
 * Get all roles
 * GET /api/roles
 */
export const getAllRoles = async (_: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`SELECT * FROM role`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roles", details: err });
  }
};

/**
 * Update a role
 * PUT /api/roles/:id
 */
export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { permission } = req.body;

  if (!Array.isArray(permission)) {
    res.status(400).json({ error: "permission must be an array of strings" });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE role SET permission = $1 WHERE role_id = $2 RETURNING *`,
      [permission, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update role", details: err });
  }
};

/**
 * Delete a role
 * DELETE /api/roles/:id
 */
export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM role WHERE role_id = $1`, [
      id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete role", details: err });
  }
};
