import express, { Request, Response } from 'express';
import corrida from './corrida.routes';
import motorista from './motorista.routes';
import auth from './auth.routes';

const router = express.Router();

router.get("/status", (_: Request, res: Response) => res.json({status: "OK"}));

router.use(corrida)
router.use(motorista);
router.use(auth);

export default router;
