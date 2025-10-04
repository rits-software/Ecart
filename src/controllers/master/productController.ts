import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Product } from "../../models/master/product";

const productRepo = AppDataSource.getRepository(Product);

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = productRepo.create(req.body);
    await productRepo.save(product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOneBy({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOneBy({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await productRepo.save(product);

    res.json(product);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update product", error: err });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productRepo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
};
