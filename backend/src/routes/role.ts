import express  from "express";

import {
    createRole,
    getAllRoles,
    updateRole,
    deleteRole,
  } from "../controllers/role";

  const router = express.Router();

// POST /api/roles 
router.post("/", createRole);

// GET /api/roles 
router.get("/", getAllRoles);

// PUT /api/roles/:id 
router.put("/:id", updateRole);

// DELETE /api/roles/:id 
router.delete("/:id", deleteRole);

export default router;