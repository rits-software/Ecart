// src/routes/purchaseRoutes.ts
import { Router } from "express";
import { createSale, deleteSale, getSale, getSales, updateSale } from "../../controllers/entries/salesController";

const router = Router();

router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
