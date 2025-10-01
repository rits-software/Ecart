import { Request, Response } from "express";

import { AppDataSource } from "../../config/db";
import { Product } from "../../models/master/product";
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
    const products = await productRepo.find({ relations: ["vendor"] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOne({
      where: { id: req.params.id },
      relations: ["vendor"],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productRepo.findOne({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    productRepo.merge(product, req.body);
    await productRepo.save(product);
    res.json(product);
  } catch (err) {
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
