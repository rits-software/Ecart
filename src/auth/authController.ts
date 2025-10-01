import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/db";
import { User,Role } from "../models/userModel";

const SECRET = process.env.JWT_SECRET_KEY || "fallback_secret";

// Repository for User entity
const userRepo = AppDataSource.getRepository(User);

// ================== SIGNUP ==================
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = userRepo.create({
      email,
      password: hashedPassword,
      role: role || Role.USER, // default role
    });

    await userRepo.save(newUser);

    res.json({
      message: "User registered",
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== LOGIN ==================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
