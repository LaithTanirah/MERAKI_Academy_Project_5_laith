import { Request, Response } from 'express';
import pool from '../models/connectDB';

/*
  GET /api/roles
 */
export const getAllRoles = async (_: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT * FROM role WHERE is_deleted = false`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

/**
 * GET /api/roles/:id
 */
export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  try {
    const result = await pool.query(
      `SELECT * FROM role WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

/**
  POST /api/roles
 */
export const createRole = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Role name is required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO role (name, is_deleted) VALUES ($1, false) RETURNING *`,
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

/*
  PUT /api/roles/:id
  */
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Role name is required' });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE role
          SET name = $1
        WHERE id = $2 AND is_deleted = false
      RETURNING *`,
      [name, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Role not found or already deleted' });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

/*
  DELETE /api/roles/:id
 */
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  try {
    const result = await pool.query(
      `UPDATE role
          SET is_deleted = true
        WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Role not found or already deleted' });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};
