import { Router } from "express";
import { createCity, deleteCity, getCities, getCityById, updateCity } from "../../controllers/common/cityController";

const router = Router();

router.post("/", createCity);
router.get("/", getCities);
router.get("/:id", getCityById);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);

export default router;
