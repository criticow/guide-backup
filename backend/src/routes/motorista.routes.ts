
import express from "express";
import {
  changeStatusHandler,
  createMotoristaHandler,
  getMotoristaHandler,
  getMotoristasHandler,
  setActiveCorridaHandler,
  registerTokenHandler
} from "../controllers/motorista.controller";
import validateResource from "../middlewares/validateResource";
import { changeStatusSchema, createMotoristaSchema, registerTokenSchema } from "../schemas/motorista.schema";

const router = express.Router();

router.post("/api/motoristas", validateResource(createMotoristaSchema), createMotoristaHandler);
router.get("/api/motoristas", getMotoristasHandler);
router.get("/api/motoristas/:id", getMotoristaHandler);
router.put("/api/motoristas/register-token", validateResource(registerTokenSchema), registerTokenHandler);
router.put("/api/motoristas/active-corrida", setActiveCorridaHandler);
router.put("/api/motoristas/change-status", validateResource(changeStatusSchema), changeStatusHandler);

export default router;