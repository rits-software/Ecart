// src/controllers/salesController.ts
import { Request, Response } from "express";
import { Sales } from "../../models/entries/Sales";
import { AppDataSource } from "../../config/db";
import { Customer } from "../../models/master/customer";
import { Product } from "../../models/master/product";
import { SalesItem } from "../../models/entries/salesItem";

const salesRepo = AppDataSource.getRepository(Sales);
const customerRepo = AppDataSource.getRepository(Customer);
const productRepo = AppDataSource.getRepository(Product);

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await salesRepo.find({
      relations: ["customer", "items", "items.product"],
    });

    const result = sales.map((s) => ({
      id: s.id,
      total: s.total,
      notes: s.notes,
      createdAt: s.createdAt,
      customer_id: s.customer?.id ?? null,
      customer: s.customer?.name ?? "",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

export const getSale = async (req: Request, res: Response) => {
  try {
    const sale = await salesRepo.findOne({
      where: { id: req.params.id },
      relations: ["customer", "items", "items.product"],
    });

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const result = {
      id: sale.id,
      total: sale.total,
      notes: sale.notes,
      createdAt: sale.createdAt,
      customer_id: sale.customer?.id ?? null,
      customer: sale.customer?.name ?? "",
      items: sale.items.map((i) => ({
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
    res.status(500).json({ message: "Failed to fetch sale" });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const saleData = req.body;

    // 1. Fetch Customer
    const customer = await customerRepo.findOneBy({ id: saleData.customer_id });
    if (!customer) return res.status(400).json({ message: "Customer not found" });

    // 2. Process items
    const items: SalesItem[] = [];
    for (const item of saleData.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      const saleItem = salesRepo.manager.create(SalesItem, {
        product,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.quantity) * Number(item.price),
      });

      items.push(saleItem);
    }

    // 3. Calculate total
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    // 4. Save sale
    const newSale = salesRepo.create({
      customer,
      items,
      total,
      notes: saleData.notes,
    });
    const saved = await salesRepo.save(newSale);

    // 5. Return formatted response
    const result = {
      id: saved.id,
      total: saved.total,
      notes: saved.notes,
      createdAt: saved.createdAt,
      customer_id: customer.id,
      customer: customer.name,
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
    res.status(500).json({ message: "Failed to create sale" });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sale = await salesRepo.findOne({
      where: { id },
      relations: ["items", "items.product", "customer"],
    });
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const updateData = req.body;

    // 1. Fetch Customer
    const customer = await customerRepo.findOneBy({ id: updateData.customer_id });
    if (!customer) return res.status(400).json({ message: "Customer not found" });

    // 2. Track existing items
    const existingItems = sale.items;

    // 3. Build final items array
    const finalItems: SalesItem[] = [];
    for (const item of updateData.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      let saleItem: SalesItem;

      if (item.id) {
        // 🔹 Update existing item
        const existing = existingItems.find((i) => i.id === item.id);
        if (existing) {
          existing.product = product;
          existing.quantity = Number(item.quantity);
          existing.price = Number(item.price);
          existing.subtotal = existing.quantity * existing.price;
          saleItem = existing;
        } else {
          // If id is passed but not found, create fresh
          saleItem = salesRepo.manager.create(SalesItem, {
            product,
            quantity: Number(item.quantity),
            price: Number(item.price),
            subtotal: Number(item.quantity) * Number(item.price),
          });
        }
      } else {
        // 🔹 New item
        saleItem = salesRepo.manager.create(SalesItem, {
          product,
          quantity: Number(item.quantity),
          price: Number(item.price),
          subtotal: Number(item.quantity) * Number(item.price),
        });
      }

      finalItems.push(saleItem);
    }

    // 4. Calculate total
    const total = finalItems.reduce((acc, i) => acc + i.subtotal, 0);

    // 5. Assign updates
    sale.customer = customer;
    sale.items = finalItems;
    sale.total = total;
    sale.notes = updateData.notes;

    // 6. Save updated sale (cascade should handle SalesItem updates)
    const updated = await salesRepo.save(sale);

    // 7. Return formatted response
    const result = {
      id: updated.id,
      total: updated.total,
      notes: updated.notes,
      createdAt: updated.createdAt,
      customer_id: customer.id,
      customer: customer.name,
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
    res.status(500).json({ message: "Failed to update sale" });
  }
};


export const deleteSale = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await salesRepo.delete(id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Sale not found" });
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete sale" });
  }
};
