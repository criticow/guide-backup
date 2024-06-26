import express from "express";
import {
  addMotoristaHandler,
  connectMotoristaHandler,
  createCorridaHandler,
  getCorridaHandler,
  getCorridasHandler,
  updateCorridaHandler,
  updateStatusHandler
} from "../controllers/corrida.controller";
import validateResource from "../middlewares/validateResource";
import { connectMotoristaSchema, createCorridaSchema, updateCorridaSchema, updateStatusSchema } from "../schemas/corrida.schema";
import { addMotoristaSchema } from "../schemas/motorista.schema";

const router = express.Router();

router.post("/api/corridas", validateResource(createCorridaSchema), createCorridaHandler);
router.get("/api/corridas", getCorridasHandler);
router.get("/api/corridas/:id", getCorridaHandler);
router.put("/api/corridas", validateResource(updateCorridaSchema), updateCorridaHandler);
router.put("/api/corridas/connect-motorista", validateResource(connectMotoristaSchema), connectMotoristaHandler);
router.put("/api/corridas/add-motorista", validateResource(addMotoristaSchema), addMotoristaHandler);
router.put("/api/corridas/update-status", validateResource(updateStatusSchema), updateStatusHandler);

export default router;