import { Router } from "express";
import { createCountry, deleteCountry, getCountries, getCountryById, updateCountry } from "../../controllers/common/countryController";

const router = Router();

router.post("/", createCountry);
router.get("/", getCountries);
router.get("/:id", getCountryById);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

export default router;
