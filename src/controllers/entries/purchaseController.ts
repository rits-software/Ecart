// src/controllers/purchaseController.ts
import { Request, Response } from "express";
import { Purchase } from "../../models/entries/Purchase";
import { AppDataSource } from "../../config/db";
import { Vendor } from "../../models/master/vendor";
import { Product } from "../../models/master/product";

const purchaseRepo = AppDataSource.getRepository(Purchase);
const vendorRepo = AppDataSource.getRepository(Vendor);
const productRepo = AppDataSource.getRepository(Product);


export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseRepo.find({
      relations: ["vendor", "items", "items.product"],
    });

    // Format response
    const result = purchases.map((p) => ({
      id: p.id,
      total: p.total,
      notes: p.notes,
      createdAt: p.createdAt,
      vendor_id: p.vendor?.id ?? null,
      vendor: p.vendor?.name ?? "",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

export const getPurchase = async (req: Request, res: Response) => {
  try {
    const purchase = await purchaseRepo.findOne({
      where: { id: req.params.id },
      relations: ["vendor", "items", "items.product"],
    });

    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    const result = {
      id: purchase.id,
      total: purchase.total,
      notes: purchase.notes,
      createdAt: purchase.createdAt,
      vendor_id: purchase.vendor?.id ?? null,
      vendor: purchase.vendor?.name ?? "",
      items: purchase.items.map((i) => ({
        id: i.id,
        product_id: i.product?.id ?? null,
        product: i.product?.name ?? "",
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch purchase" });
  }
};

// export const createPurchase = async (req: Request, res: Response) => {
//   try {
//     const purchaseData = req.body;

//     // 1. Fetch Vendor
//     const vendorRepo = AppDataSource.getRepository("Vendor");
//     const vendor = await vendorRepo.findOneBy({ id: purchaseData.vendor });
//     if (!vendor) return res.status(400).json({ message: "Vendor not found" });

//     // 2. Process items
//     const productRepo = AppDataSource.getRepository("Product");
//     const items: any[] = [];

//     for (const item of purchaseData.items) {
//       const product = await productRepo.findOneBy({ id: item.product });
//       if (!product)
//         return res
//           .status(400)
//           .json({ message: `Product ${item.product} not found` });

//       items.push({
//         ...item,
//         product,
//         subtotal: item.quantity * item.price,
//       });
//     }

//     // 3. Calculate total
//     const total = items.reduce((acc, i) => acc + i.subtotal, 0);

//     // 4. Create purchase object
//     const newPurchase = purchaseRepo.create({
//       vendor,
//       items,
//       total,
//       notes: purchaseData.notes,
//     });

//     const saved = await purchaseRepo.save(newPurchase);
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create purchase" });
//   }
// };

// export const updatePurchase = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const purchase = await purchaseRepo.findOne({
//       where: { id },
//       relations: ["items"],
//     });
//     if (!purchase) return res.status(404).json({ message: "Purchase not found" });

//     const updateData = req.body;

//     // 1. Fetch Vendor
//     const vendor = await vendorRepo.findOneBy({ id: updateData.vendor_id });
//     if (!vendor) return res.status(400).json({ message: "Vendor not found" });

//     // 2. Process items
//     const items: any[] = [];
//     for (const item of updateData.items) {
//       const product = await productRepo.findOneBy({ id: item.product_id });
//       if (!product) {
//         return res.status(400).json({ message: `Product ${item.product_id} not found` });
//       }

//       items.push({
//         ...item,
//         product,
//         subtotal: Number(item.quantity) * Number(item.price),
//       });
//     }

//     // 3. Calculate total
//     const total = items.reduce((acc, i) => acc + i.subtotal, 0);

//     // 4. Merge update into purchase
//     purchase.vendor = vendor;
//     purchase.items = items;
//     purchase.total = total;
//     purchase.notes = updateData.notes;

//     const updated = await purchaseRepo.save(purchase);

//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update purchase" });
//   }
// };

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const purchaseData = req.body;

    // 1. Fetch Vendor
    const vendor = await vendorRepo.findOneBy({ id: purchaseData.vendor_id });
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    // 2. Process items
    const items: any[] = [];
    for (const item of purchaseData.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      items.push({
        product,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.quantity) * Number(item.price),
      });
    }

    // 3. Calculate total
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    // 4. Save purchase
    const newPurchase = purchaseRepo.create({
      vendor,
      items,
      total,
      notes: purchaseData.notes,
    });
    const saved = await purchaseRepo.save(newPurchase);

    // 5. Return formatted response
    const result = {
      id: saved.id,
      total: saved.total,
      notes: saved.notes,
      createdAt: saved.createdAt,
      vendor_id: vendor.id,
      vendor: vendor.name,
      items: saved.items.map((i) => ({
        id: i.id,
        product_id: i.product.id,
        product: i.product.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
    };

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create purchase" });
  }
};


export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const purchase = await purchaseRepo.findOne({
      where: { id },
      relations: ["items", "items.product", "vendor"],
    });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    const updateData = req.body;

    // 1. Fetch Vendor
    const vendor = await vendorRepo.findOneBy({ id: updateData.vendor_id });
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    // 2. Process items
    const items: any[] = [];
    for (const item of updateData.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      items.push({
        product,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.quantity) * Number(item.price),
      });
    }

    // 3. Calculate total
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    // 4. Update purchase
    purchase.vendor = vendor;
    purchase.items = items;
    purchase.total = total;
    purchase.notes = updateData.notes;

    const updated = await purchaseRepo.save(purchase);

    // 5. Return formatted response
    const result = {
      id: updated.id,
      total: updated.total,
      notes: updated.notes,
      createdAt: updated.createdAt,
      vendor_id: vendor.id,
      vendor: vendor.name,
      items: updated.items.map((i) => ({
        id: i.id,
        product_id: i.product.id,
        product: i.product.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update purchase" });
  }
};


export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await purchaseRepo.delete(id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Purchase not found" });
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete purchase" });
  }
};
