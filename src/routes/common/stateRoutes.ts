import { Router } from "express";
import { createState, deleteState, getStateById, getStates, updateState } from "../../controllers/common/stateController";

const router = Router();

router.post("/", createState);
router.get("/", getStates);
router.get("/:id", getStateById);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

export default router;
