import { Request, Response } from "express";
import prisma from "../db/client";
import { MD5 } from "crypto-js";
import { updatePassword } from "../services/motorista.service";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  try {
    const {cpf, senha} = req.body;
    const motorista = await prisma.motorista.findFirst({where: {cpf: cpf}});

    if(motorista) {
      if(motorista.senha === MD5(senha).toString())
        return res.json(motorista);
    }

    res.status(401).json({msg: "Credênciais inválidas, CPF não cadastrado ou senha incorreta. Cadastre ou altere sua senha."});
  } catch (error) {
    res.status(500).json({msg: "Erro ao fazer login"});
  }
};

export const registerHandler = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  try {
    const {cpf, senha, dataNascimento} = req.body;
    const motorista = await prisma.motorista.findFirst({where: {cpf: cpf}});
    if(motorista)
    {
      if(motorista.dataNascimento.valueOf() === new Date(dataNascimento).valueOf())
      {
        updatePassword(cpf, senha);
        return res.json(motorista);
      }
    }

    res.status(401).json({msg: "Informações inválidas, CPF não cadastrado ou data de nascimento incorreta."});
  } catch (error) {
    res.status(500).json({msg: "Erro ao registrar nova senha"});
  }
};