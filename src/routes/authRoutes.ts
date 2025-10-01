import { Router } from "express";
import { signup, login } from "../auth/authController";
import { verifyToken, requireRoles } from "../auth/middleware";

const router = Router();

// Public
router.post("/signup", signup);
router.post("/login", login);

// Protected (any logged-in user)
router.get("/me", verifyToken, (req, res) => {
  // `verifyToken` middleware should attach user info to req.user
  const user = (req as any).user;
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
});

// Vendor or Admin
router.get("/vendor-products", verifyToken, requireRoles(["vendor", "admin"]), (req, res) => {
  res.json({ message: "Vendor/Admin access granted" });
});

// Admin only
router.get("/all-users", verifyToken, requireRoles(["admin"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Logged out successfully" });
});

export default router;
