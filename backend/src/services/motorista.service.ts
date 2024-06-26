import { Motorista } from "@prisma/client"
import prisma from "../db/client";
import md5 from 'crypto-js/md5'
import { CreateMotoristaInput } from "../schemas/motorista.schema";

export const createMotorista = async (data: CreateMotoristaInput) => {
  let motorista = null;
  try {
    motorista = await prisma.motorista.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        dataNascimento: new Date(data.dataNascimento),
        cnh: data.cnh,
        whatsapp: data.whatsapp,
        online: true
      }
    })
  } catch (error) {
    console.log(error);
  }
  return motorista;
};

export const getMotoristas = async () => {
  let motoristas: Motorista[] = [];
  try {
    motoristas = await prisma.motorista.findMany();
  } catch (error) {
    console.log(error);
  }
  return motoristas;
};

export const getMotorista = async (motoristaId: number) => {
  let motorista = null;
  try {
    motorista = await prisma.motorista.findFirst({ where: { id: motoristaId }})
  } catch (error) {
    console.log(error);
  }
  return motorista;
};

export const updatePassword = async (cpf: string, password: string) => {
  try {
    const hash = md5(password).toString();
    await prisma.motorista.update({
      where: {cpf: cpf},
      data: { senha: hash }
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTokens = async () => {
  let motoristas: Motorista[] = [];
  try {
    motoristas = await prisma.motorista.findMany({
      where: { token: { not: null }, online: true }
    })
  } catch (error) {
    console.log(error);
  }
  return motoristas;
}

export const registerToken = async (cpf: string, token: string) => {
  let motorista;
  try {
    motorista = await prisma.motorista.update({
      where: {cpf: cpf},
      data: {token: token}
    });
  } catch (error) {
    console.log(error);
  }
  return motorista;
}

export const setActiveCorridaId = async (cpf: string, corridaId: number) => {
  let motorista;
  try {
    motorista = await prisma.motorista.findFirst({ where: {cpf: cpf }});
    const corrida = await prisma.corrida.findFirst({where: {id: corridaId}});

    if(motorista && corrida) {
      let data;

      if(corrida.statusId === 8 || corridaId === motorista.activeCorridaId) {
        data = { activeCorridaId: null };
      } else {
        data = {activeCorridaId: corridaId}
      }

      motorista = await prisma.motorista.update({
        where: {cpf: cpf},
        data
      })
    }

  } catch (error) {
    console.log(error);
  }
  return motorista;
}

export const changeStatus = async (cpf: string, online: boolean) => {
  let motorista;
  try {
    motorista = await prisma.motorista.update({
      where: {cpf: cpf},
      data: {online: online}
    })
  } catch (error) {
    console.log(error);
  }
  return motorista;
}