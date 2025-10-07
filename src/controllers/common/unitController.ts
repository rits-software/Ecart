import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Unit } from "../../models/common/unit";

const unitRepo = AppDataSource.getRepository(Unit);

export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name,description } = req.body;
    const unit = unitRepo.create({ name, description });
    await unitRepo.save(unit);
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: "Failed to create unit", error: err });
  }
};

export const getUnits = async (req: Request, res: Response) => {
  try {
    const units = await unitRepo.find();
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch units", error: err });
  }
};

export const getUnitById = async (req: Request, res: Response) => {
  try {
    const unit = await unitRepo.findOne({
      where: { id: req.params.id },
    });
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: "Error fetching unit", error: err });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  try {
    const unit = await unitRepo.findOne({ where: { id: req.params.id } });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    unitRepo.merge(unit, req.body);
    await unitRepo.save(unit);
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: "Failed to update unit", error: err });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  try {
    const result = await unitRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Unit not found" });

    res.json({ message: "Unit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete unit", error: err });
  }
};
