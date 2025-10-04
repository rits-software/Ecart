// src/controllers/common/pinCodeController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { City } from "../../models/common/city";
import { State } from "../../models/common/state";
import { Country } from "../../models/common/country";
import { Pincode } from "../../models/common/pincode";

const pinCodeRepo = AppDataSource.getRepository(Pincode);
const cityRepo = AppDataSource.getRepository(City);
const stateRepo = AppDataSource.getRepository(State);
const countryRepo = AppDataSource.getRepository(Country);

// Get all pin codes
export const getPinCodes = async (req: Request, res: Response) => {
  try {
    const pinCodes = await pinCodeRepo.find({
      relations: ["city", "state", "country"],
    });

    const result = pinCodes.map((p) => ({
      id: p.id,
      code: p.code.toString(),
      city_id: p.city?.id ?? null,
      city: p.city?.name ?? "",
      state_id: p.state?.id ?? null,
      state: p.state?.name ?? "",
      country_id: p.country?.id ?? null,
      country: p.country?.name ?? "",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pin codes", error: err });
  }
};

// Get pin code by ID
export const getPinCodeById = async (req: Request, res: Response) => {
  try {
    const pin = await pinCodeRepo.findOne({
      where: { id: req.params.id },
      relations: ["city", "state", "country"],
    });

    if (!pin) return res.status(404).json({ message: "Pin code not found" });

    const result = {
      id: pin.id,
      code: pin.code.toString(),
      city_id: pin.city?.id ?? null,
      city: pin.city?.name ?? "",
      state_id: pin.state?.id ?? null,
      state: pin.state?.name ?? "",
      country_id: pin.country?.id ?? null,
      country: pin.country?.name ?? "",
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pin code", error: err });
  }
};

// Create new pin code
export const createPinCode = async (req: Request, res: Response) => {
  try {
    const { code, city_id, state_id, country_id } = req.body;

    const city = await cityRepo.findOneBy({ id: city_id });
    if (!city) return res.status(400).json({ message: "City not found" });

    const state = await stateRepo.findOneBy({ id: state_id });
    if (!state) return res.status(400).json({ message: "State not found" });

    const country = await countryRepo.findOneBy({ id: country_id });
    if (!country) return res.status(400).json({ message: "Country not found" });

    const newPin = pinCodeRepo.create({
      code,
      city,
      state,
      country,
    });

    const saved = await pinCodeRepo.save(newPin);

    const result = {
      id: saved.id,
      code: saved.code.toString(),
      city_id: city.id,
      city: city.name,
      state_id: state.id,
      state: state.name,
      country_id: country.id,
      country: country.name,
    };

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create pin code", error: err });
  }
};

// Update pin code
export const updatePinCode = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pin = await pinCodeRepo.findOne({
      where: { id },
      relations: ["city", "state", "country"],
    });
    if (!pin) return res.status(404).json({ message: "Pin code not found" });

    const { code, city_id, state_id, country_id } = req.body;

    if (city_id) {
      const city = await cityRepo.findOneBy({ id: city_id });
      if (!city) return res.status(400).json({ message: "City not found" });
      pin.city = city;
    }

    if (state_id) {
      const state = await stateRepo.findOneBy({ id: state_id });
      if (!state) return res.status(400).json({ message: "State not found" });
      pin.state = state;
    }

    if (country_id) {
      const country = await countryRepo.findOneBy({ id: country_id });
      if (!country) return res.status(400).json({ message: "Country not found" });
      pin.country = country;
    }

    if (code) pin.code = code;

    const updated = await pinCodeRepo.save(pin);

    const result = {
      id: updated.id,
      code: updated.code.toString(),
      city_id: updated.city?.id ?? null,
      city: updated.city?.name ?? "",
      state_id: updated.state?.id ?? null,
      state: updated.state?.name ?? "",
      country_id: updated.country?.id ?? null,
      country: updated.country?.name ?? "",
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update pin code", error: err });
  }
};

// Delete pin code
export const deletePinCode = async (req: Request, res: Response) => {
  try {
    const result = await pinCodeRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Pin code not found" });

    res.json({ message: "Pin code deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete pin code", error: err });
  }
};
