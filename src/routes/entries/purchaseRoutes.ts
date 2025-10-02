// src/routes/purchaseRoutes.ts
import { Router } from "express";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../../controllers/entries/purchaseController";

const router = Router();

router.get("/", getPurchases);
router.get("/:id", getPurchase);
router.post("/", createPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
