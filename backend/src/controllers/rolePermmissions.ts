import { Request, Response } from "express";
import pool from "../models/connectDB";

// Assign a permission to a role
export const assignPermissionToRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId, permissionId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO role_permission (role_id, permission_id)
       VALUES ($1, $2)
       RETURNING *`,
      [roleId, permissionId]
    );

    res.status(201).json({
      success: true,
      message: 'Permission assigned to role',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Assign permission error:', error);
    res.status(500).json({ error: 'Failed to assign permission to role' });
  }
};

// Remove a permission from a role (permanent delete)
export const removePermissionFromRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId, permissionId } = req.body;

  try {
    const result = await pool.query(
      `DELETE FROM role_permission
       WHERE role_id = $1 AND permission_id = $2`,
      [roleId, permissionId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Remove permission error:', error);
    res.status(500).json({ error: 'Failed to remove permission from role' });
  }
};

// Get all permissions assigned to a specific role
export const getPermissionsByRole = async (req: Request, res: Response): Promise<void> => {
  const roleId = +req.params.roleId;

  try {
    const result = await pool.query(
      `SELECT p.* FROM permission p
       JOIN role_permission rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`,
      [roleId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get permissions by role error:', error);
    res.status(500).json({ error: 'Failed to fetch permissions for this role' });
  }
};

// Get all roles that have a specific permission
export const getRolesByPermission = async (req: Request, res: Response): Promise<void> => {
  const permissionId = +req.params.permissionId;

  try {
    const result = await pool.query(
      `SELECT r.* FROM role r
       JOIN role_permission rp ON r.id = rp.role_id
       WHERE rp.permission_id = $1`,
      [permissionId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get roles by permission error:', error);
    res.status(500).json({ error: 'Failed to fetch roles for this permission' });
  }
};
