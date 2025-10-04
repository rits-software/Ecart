import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { City } from "../../models/common/city";

const cityRepo = AppDataSource.getRepository(City);

export const createCity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const city = cityRepo.create({ name });
    await cityRepo.save(city);
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: "Failed to create city", error: err });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await cityRepo.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cities", error: err });
  }
};

export const getCityById = async (req: Request, res: Response) => {
  try {
    const city = await cityRepo.findOne({
      where: { id: req.params.id },
    });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: "Error fetching city", error: err });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const city = await cityRepo.findOne({ where: { id: req.params.id } });
    if (!city) return res.status(404).json({ message: "City not found" });

    cityRepo.merge(city, req.body);
    await cityRepo.save(city);
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: "Failed to update city", error: err });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const result = await cityRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "City not found" });

    res.json({ message: "City deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete city", error: err });
  }
};
