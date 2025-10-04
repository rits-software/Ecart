import { Router } from "express";
import { createPinCode, deletePinCode, getPinCodeById, getPinCodes, updatePinCode } from "../../controllers/common/pincodeController";

const router = Router();

router.post("/", createPinCode);
router.get("/", getPinCodes);
router.get("/:id", getPinCodeById);
router.put("/:id", updatePinCode);
router.delete("/:id", deletePinCode);

export default router;
