import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Category } from "../../models/common/category";

const categoryRepo = AppDataSource.getRepository(Category);

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = categoryRepo.create({ name });
    await categoryRepo.save(category);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to create category", error: err });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepo.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryRepo.findOne({
      where: { id: req.params.id },
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category", error: err });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryRepo.findOne({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ message: "Category not found" });

    categoryRepo.merge(category, req.body);
    await categoryRepo.save(category);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category", error: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err });
  }
};
