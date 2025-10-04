import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { State } from "../../models/common/state";

const stateRepo = AppDataSource.getRepository(State);

export const createState = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const state = stateRepo.create({ name });
    await stateRepo.save(state);
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: "Failed to create state", error: err });
  }
};

export const getStates = async (req: Request, res: Response) => {
  try {
    const states = await stateRepo.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch states", error: err });
  }
};

export const getStateById = async (req: Request, res: Response) => {
  try {
    const state = await stateRepo.findOne({
      where: { id: req.params.id },
    });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: "Error fetching state", error: err });
  }
};

export const updateState = async (req: Request, res: Response) => {
  try {
    const state = await stateRepo.findOne({ where: { id: req.params.id } });
    if (!state) return res.status(404).json({ message: "State not found" });

    stateRepo.merge(state, req.body);
    await stateRepo.save(state);
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: "Failed to update state", error: err });
  }
};

export const deleteState = async (req: Request, res: Response) => {
  try {
    const result = await stateRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "State not found" });

    res.json({ message: "State deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete state", error: err });
  }
};
