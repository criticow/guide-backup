
import express from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controller";
import validateResource from "../middlewares/validateResource";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = express.Router();

router.post("/api/auth/login", validateResource(loginSchema), loginHandler);
router.post("/api/auth/register", validateResource(registerSchema), registerHandler);

export default router;