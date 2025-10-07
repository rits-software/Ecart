import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { HSNCode } from "../../models/common/hsncode";

const unitRepo = AppDataSource.getRepository(HSNCode);

export const createHSNCode = async (req: Request, res: Response) => {
  try {
    const { name, description, gst } = req.body;
    const hsncode = unitRepo.create({ name, description, gst });
    await unitRepo.save(hsncode);
    res.json(hsncode);
  } catch (err) {
    res.status(500).json({ message: "Failed to create hsncode", error: err });
  }
};

export const getHSNCodes = async (req: Request, res: Response) => {
  try {
    const hsncodes = await unitRepo.find();
    res.json(hsncodes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hsncodes", error: err });
  }
};

export const getHSNCodeById = async (req: Request, res: Response) => {
  try {
    const hsncode = await unitRepo.findOne({
      where: { id: req.params.id },
    });
    if (!hsncode) return res.status(404).json({ message: "HSNCode not found" });
    res.json(hsncode);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hsncode", error: err });
  }
};

export const updateHSNCode = async (req: Request, res: Response) => {
  try {
    const hsncode = await unitRepo.findOne({ where: { id: req.params.id } });
    if (!hsncode) return res.status(404).json({ message: "HSNCode not found" });

    unitRepo.merge(hsncode, req.body);
    await unitRepo.save(hsncode);
    res.json(hsncode);
  } catch (err) {
    res.status(500).json({ message: "Failed to update hsncode", error: err });
  }
};

export const deleteHSNCode = async (req: Request, res: Response) => {
  try {
    const result = await unitRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "HSNCode not found" });

    res.json({ message: "HSNCode deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete hsncode", error: err });
  }
};
