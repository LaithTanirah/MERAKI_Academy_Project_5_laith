import { Router } from "express";

import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission";

const router = Router();

// GET    /api/permissions
router.get("/", getAllPermissions);

// GET    /api/permissions/:id

router.get("/:id", getPermissionById);

// POST   /api/permissions

router.post("/", createPermission);

// PUT    /api/permissions/:id

router.put("/:id", updatePermission);

// DELETE /api/permissions/:id

router.delete("/:id", deletePermission);

export default router;
