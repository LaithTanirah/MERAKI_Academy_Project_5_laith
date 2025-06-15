import { Router } from "express";

import {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
  getRolesByPermission,
} from "../controllers/rolePermmissions";
const router = Router();
// POST
router.post("/", assignPermissionToRole);

// DELETE
router.delete("/", removePermissionFromRole);
// GET
router.get("/role/:roleId", getPermissionsByRole);
// GET
router.get("/permission/:permissionId", getRolesByPermission);

export default router;
