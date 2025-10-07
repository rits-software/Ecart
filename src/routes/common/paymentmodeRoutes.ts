import { Router } from "express";
import { createPaymentmode, deletePaymentmode, getPaymentmodes, getPaymentmodeById, updatePaymentmode } from "../../controllers/common/paymentmodeController";

const router = Router();

router.post("/", createPaymentmode);
router.get("/", getPaymentmodes);
router.get("/:id", getPaymentmodeById);
router.put("/:id", updatePaymentmode);
router.delete("/:id", deletePaymentmode);

export default router;
