import { Request, Response } from "express";
import pool from "../models/connectDB";

// get All permissions not removed is_deleted = false
export const getAllPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM permission WHERE is_deleted = false"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get permissions error:", error);

    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

//get permmission by Id
export const getPermissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM permission WHERE id = $1 AND is_deleted = false",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Permission not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get permission error:", error);
    res.status(500).json({ error: "Failed to fetch permission" });
  }
};

/* <----------------------------------------------------------------------------> */

//Create Permission
export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO permission (name, is_deleted) VALUES ($1, false) RETURNING *",
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create permission error:", error);
    res.status(500).json({ error: "Failed to create permission" });
  }
};

//Edit name Of permmision if is not delelted <put>

export const updatePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;
  const { name } = req.body;

  try {
    const result = await pool.query(
      "UPDATE permission SET name = $1 WHERE id = $2 AND is_deleted = false RETURNING *",
      [name, id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ message: "Permission not found or already deleted" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update permission error:", error);
    res.status(500).json({ error: "Failed to update permission" });
  }
};

//Soft Deleted
export const deletePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = +req.params.id;

  try {
    const result = await pool.query(
      "UPDATE permission SET is_deleted = true WHERE id = $1 AND is_deleted = false",
      [id]
    );

    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ message: "Permission not found or already deleted" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Delete permission error:", error);
    res.status(500).json({ error: "Failed to delete permission" });
  }
};
