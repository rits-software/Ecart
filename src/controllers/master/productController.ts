import { Request, Response } from "express";

import { AppDataSource } from "../../config/db";
import { Product } from "../../models/master/product";
import { Vendor } from "../../models/master/vendor";
const productRepo = AppDataSource.getRepository(Product);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = productRepo.create(req.body);
    await productRepo.save(product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.vendor", "vendor")
      .select([
        "product.id",
        "product.name",
        "product.sku",
        "product.purchasePrice",
        "product.sellingPrice",
        "product.quantity",
        "product.taxRate",
        "vendor.id",
        "vendor.name", // select only vendor name
      ])
      .getMany();

    // Optional: map vendor.name directly
    const result = products.map((p) => ({
      ...p,
      vendor_id: p.vendor?.id ?? null, // string
      vendor: p.vendor?.name ?? "",
    }));
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOne({
      where: { id: req.params.id },
      relations: ["vendor"],
      select: [
        "id",
        "name",
        "sku",
        "purchasePrice",
        "sellingPrice",
        "quantity",
        "taxRate",
      ],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Format result like getProducts
    const result = {
      ...product,
      vendor_id: product.vendor?.id ?? null,
      vendor: product.vendor?.name ?? "",
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOne({
      where: { id: req.params.id },
      relations: ["vendor"],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { vendor, vendor_id, ...fields } = req.body;

    // ✅ If vendor_id provided, update relation properly
    if (vendor_id) {
      const vendorEntity = await AppDataSource.getRepository(Vendor).findOne({
        where: { id: vendor_id },
      });
      if (!vendorEntity) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      product.vendor = vendorEntity;
    }

    // ✅ Merge other fields (ignore vendor string)
    Object.assign(product, fields);

    await productRepo.save(product);

    // ✅ Return result in same format as getProducts
    const result = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      quantity: product.quantity,
      taxRate: product.taxRate,
      vendor_id: product.vendor?.id ?? null,
      vendor: product.vendor?.name ?? "",
    };

    res.json(result);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update product", error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
};
