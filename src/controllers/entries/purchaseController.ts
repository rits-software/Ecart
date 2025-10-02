// src/controllers/purchaseController.ts
import { Request, Response } from "express";
import { Purchase } from "../../models/entries/Purchase";
import { AppDataSource } from "../../config/db";

const purchaseRepo = AppDataSource.getRepository(Purchase);

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseRepo.find({ relations: ["vendor", "items", "items.product"] });
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

export const getPurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const purchase = await purchaseRepo.findOne({
      where: { id },
      relations: ["vendor", "items", "items.product"],
    });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchase" });
  }
};

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const purchaseData = req.body;

    // Calculate subtotal for each item
    purchaseData.items = purchaseData.items.map((item: any) => ({
      ...item,
      subtotal: item.quantity * item.price,
    }));

    // Calculate total
    purchaseData.total = purchaseData.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);

    const newPurchase = purchaseRepo.create(purchaseData);
    const saved = await purchaseRepo.save(newPurchase);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create purchase" });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const purchase = await purchaseRepo.findOne({ where: { id }, relations: ["items"] });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    const updateData = req.body;

    // Recalculate subtotal & total
    updateData.items = updateData.items.map((item: any) => ({
      ...item,
      subtotal: item.quantity * item.price,
    }));
    updateData.total = updateData.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);

    purchaseRepo.merge(purchase, updateData);
    const updated = await purchaseRepo.save(purchase);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update purchase" });
  }
};

export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await purchaseRepo.delete(id);
    if (result.affected === 0) return res.status(404).json({ message: "Purchase not found" });
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete purchase" });
  }
};
