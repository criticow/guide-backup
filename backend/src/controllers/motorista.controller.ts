import { Request, Response } from "express";
import { changeStatus, createMotorista, getMotorista, getMotoristas, setActiveCorridaId, registerToken, updatePassword } from "../services/motorista.service";
import { ChangeStatusInput, CreateMotoristaInput, RegisterTokenInput } from "../schemas/motorista.schema";

export const createMotoristaHandler = async (req: Request<{}, {}, CreateMotoristaInput>, res: Response) => {
  try {
    const body = req.body;
    const motorista = await createMotorista(body);
    res.json(motorista);
  } catch (error) {
    res.status(500).json({msg: "Erro ao criar motorista"});
  }
};

export const getMotoristaHandler = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const motorista = await getMotorista(Number(id));
    res.json(motorista);
  } catch (error) {
    res.status(500).json({msg: "Erro ao buscar motorista"});
  }
};

export const getMotoristasHandler = async (_: Request, res: Response) => {
  try {
    const motoristas = await getMotoristas();
    res.json(motoristas);
  } catch (error) {
    res.status(500).json({msg: "Erro ao buscar motoristas"});
  }
};

export const registerTokenHandler = async (req: Request<{}, {}, RegisterTokenInput>, res: Response) => {
  try {
    const {cpf, token} = req.body;
    const motorista = await registerToken(cpf, token);
    res.json(motorista);
  } catch (error) {
    res.status(500).json({msg: "Erro ao setar token"});
  }
}

export const setActiveCorridaHandler = async (req: Request, res: Response) => {
  try {
    const {cpf, corridaId} = req.body;
    const motorista = await setActiveCorridaId(cpf, corridaId);
    res.json(motorista);
  } catch (error) {
    res.status(500).json({msg: "Erro ao setar corridaId"});
  }
}

export const changeStatusHandler = async (req: Request<{}, {}, ChangeStatusInput>, res: Response) => {
  try {
    const {cpf, online} = req.body;
    const motorista = await changeStatus(cpf, online);
    res.json(motorista);
  } catch (error) {
    res.status(500).json({msg: "Erro ao mudar status"});
  }
}