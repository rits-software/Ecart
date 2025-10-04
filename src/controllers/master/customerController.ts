import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Customer } from "../../models/master/customer";

const customerRepo = AppDataSource.getRepository(Customer);

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, contact, address } = req.body;
    const customer = customerRepo.create({ name, contact, address });
    await customerRepo.save(customer);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to create customer", error: err });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerRepo.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers", error: err });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await customerRepo.findOne({
      where: { id: req.params.id },
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customer", error: err });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerRepo.findOne({ where: { id: req.params.id } });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customerRepo.merge(customer, req.body);
    await customerRepo.save(customer);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to update customer", error: err });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const result = await customerRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customer", error: err });
  }
};
