import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Country } from "../../models/common/country";

const countryRepo = AppDataSource.getRepository(Country);

export const createCountry = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const country = countryRepo.create({ name });
    await countryRepo.save(country);
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: "Failed to create country", error: err });
  }
};

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await countryRepo.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch countries", error: err });
  }
};

export const getCountryById = async (req: Request, res: Response) => {
  try {
    const country = await countryRepo.findOne({
      where: { id: req.params.id },
    });
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: "Error fetching country", error: err });
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  try {
    const country = await countryRepo.findOne({ where: { id: req.params.id } });
    if (!country) return res.status(404).json({ message: "Country not found" });

    countryRepo.merge(country, req.body);
    await countryRepo.save(country);
    res.json(country);
  } catch (err) {
    res.status(500).json({ message: "Failed to update country", error: err });
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  try {
    const result = await countryRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Country not found" });

    res.json({ message: "Country deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete country", error: err });
  }
};
