import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { PaymentMode } from "../../models/common/paymentmode";

const paymentmodeRepo = AppDataSource.getRepository(PaymentMode);

export const createPaymentmode = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const paymentmode = paymentmodeRepo.create({ name });
    await paymentmodeRepo.save(paymentmode);
    res.json(paymentmode);
  } catch (err) {
    res.status(500).json({ message: "Failed to create paymentmode", error: err });
  }
};

export const getPaymentmodes = async (req: Request, res: Response) => {
  try {
    const cities = await paymentmodeRepo.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cities", error: err });
  }
};

export const getPaymentmodeById = async (req: Request, res: Response) => {
  try {
    const paymentmode = await paymentmodeRepo.findOne({
      where: { id: req.params.id },
    });
    if (!paymentmode) return res.status(404).json({ message: "Paymentmode not found" });
    res.json(paymentmode);
  } catch (err) {
    res.status(500).json({ message: "Error fetching paymentmode", error: err });
  }
};

export const updatePaymentmode = async (req: Request, res: Response) => {
  try {
    const paymentmode = await paymentmodeRepo.findOne({ where: { id: req.params.id } });
    if (!paymentmode) return res.status(404).json({ message: "Paymentmode not found" });

    paymentmodeRepo.merge(paymentmode, req.body);
    await paymentmodeRepo.save(paymentmode);
    res.json(paymentmode);
  } catch (err) {
    res.status(500).json({ message: "Failed to update paymentmode", error: err });
  }
};

export const deletePaymentmode = async (req: Request, res: Response) => {
  try {
    const result = await paymentmodeRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Paymentmode not found" });

    res.json({ message: "Paymentmode deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete paymentmode", error: err });
  }
};
