import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Vendor } from "../../models/master/vendor";

const vendorRepo = AppDataSource.getRepository(Vendor);

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, contact, address } = req.body;
    const vendor = vendorRepo.create({ name, contact, address });
    await vendorRepo.save(vendor);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Failed to create vendor", error: err });
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await vendorRepo.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendors", error: err });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const vendor = await vendorRepo.findOne({
      where: { id: req.params.id },
    });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendor", error: err });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await vendorRepo.findOne({ where: { id: req.params.id } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendorRepo.merge(vendor, req.body);
    await vendorRepo.save(vendor);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Failed to update vendor", error: err });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const result = await vendorRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete vendor", error: err });
  }
};
