import { Router } from "express";
import { createHSNCode, deleteHSNCode, getHSNCodes, getHSNCodeById, updateHSNCode } from "../../controllers/common/hsnController";

const router = Router();

router.post("/", createHSNCode);
router.get("/", getHSNCodes);
router.get("/:id", getHSNCodeById);
router.put("/:id", updateHSNCode);
router.delete("/:id", deleteHSNCode);

export default router;
