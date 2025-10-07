import { Router } from "express";
import { createUnit, deleteUnit, getUnits, getUnitById, updateUnit } from "../../controllers/common/unitController";

const router = Router();

router.post("/", createUnit);
router.get("/", getUnits);
router.get("/:id", getUnitById);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
