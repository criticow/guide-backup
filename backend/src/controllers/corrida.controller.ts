import { Request, Response } from "express";
import { addMotorista, connectMotorista, createCorrida, getCorrida, getCorridas, updateCorrida, updateStatus } from "../services/corrida.service";
import { firebase } from "../services/firebase";
import { getTokens } from "../services/motorista.service";
import { MulticastMessage } from "firebase-admin/messaging";
import { ConnectMotoristaInput, CreateCorridaInput, UpdateCorridaInput, UpdateStatusInput } from "../schemas/corrida.schema";
import { AddMotoristaInput } from "../schemas/motorista.schema";
import util from "../util";

export const createCorridaHandler = async (req: Request<{}, {}, CreateCorridaInput>, res: Response) => {
  try {
    const body = req.body;
    const corrida = await createCorrida(body);

    if(corrida) {
      const motoristas = await getTokens();
      const tokens = [...new Set(motoristas.map((motorista) => motorista.token))] as string[];
      const valor = (corrida.valorQuilometro / 100) * (corrida.quilometrosRodados / 100);

      if(tokens.length > 0) {
        const message: MulticastMessage = {
          data: {
            type: "agendamento",
            agendamento: JSON.stringify(corrida),
            title: `Novo agendamento (${corrida.id})`,
            largeBody: 
            `\nValor: R$ ${util.formatDecimal(valor)}\n` +
            `Distância: ${util.formatDecimal(corrida.quilometrosRodados / 100)} km\n` +
            `Data/Hora: ${util.formatISODate(corrida.dataHora.toISOString())}\n` +
            `Cliente: ${corrida.cliente} (${corrida.passageiro})`,
            body: `R$ ${util.formatDecimal(valor)} - ${util.formatDecimal(corrida.quilometrosRodados / 100)} km`,
          },
          tokens
        }

        firebase.multicast(message);
      }
    }

    res.json(corrida);
  } catch (error) {
    res.json({msg: "Erro ao criar corrida"});
  }
};

export const updateCorridaHandler = async (req: Request<{}, {}, UpdateCorridaInput>, res: Response) => {
  try {
    const body = req.body;
    const corrida = await updateCorrida(body);

    res.json(corrida);
  } catch (error) {
    res.json({msg: "Erro ao atualizar corrida"});
  }
}

export const getCorridaHandler = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const corrida = await getCorrida(Number(id));

    res.json(corrida);
  } catch (error) {
    res.json({msg: "Erro ao buscar corrida"});
  }
};

export const getCorridasHandler = async (req: Request, res: Response) => {
  try {
    const {status, motoristaId} = req.query;
    const corridas = await getCorridas({
      status: status ? Number(status) : undefined,
      motoristaId: motoristaId ? Number(motoristaId) : undefined
    });

    res.json(corridas);
  } catch (error) {
    res.json({msg: "Erro ao buscar corridas"});
  }
};

export const connectMotoristaHandler = async (req: Request<{}, {}, ConnectMotoristaInput>, res: Response) => {
  try {
    const {corridaId, motoristaId} = req.body;
    const corrida = await connectMotorista(Number(corridaId), Number(motoristaId));
    res.json(corrida);
  } catch (error) {
    console.log(error);
  }
};

export const addMotoristaHandler = async (req: Request<{}, {}, AddMotoristaInput>, res: Response) => {
  try {
    const {corridaId, motoristaId, type} = req.body;
    const corrida = await addMotorista(Number(corridaId), Number(motoristaId), Number(type));

    res.json(corrida);
  } catch (error) {
    res.status(500).json({msg: 'Erro ao adicionar motorista'});
  }
}

export const updateStatusHandler = async (req: Request<{}, {}, UpdateStatusInput>, res: Response) => {
  try {
    const {corridaId, statusId} = req.body;
    const corrida = await updateStatus(corridaId, statusId);

    res.json(corrida);
  } catch (error) {
    res.status(500).json({msg: "Erro ao atualizar status do agendamento"});
  }
}