import express  from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,      
  updateRole,
  deleteRole,
} from "../controllers/role";

const router = express.Router();

// POST   /api/roles
router.post("/", createRole);

// GET    /api/roles       
router.get("/", getAllRoles);

// GET    /api/roles/:id    
router.get("/:id", getRoleById);

// PUT    /api/roles/:id  
router.put("/:id", updateRole);

// DELETE /api/roles/:id )
router.delete("/:id", deleteRole);

export default router;
