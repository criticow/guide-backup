import { Corrida, Prisma } from "@prisma/client";
import prisma from "../db/client";
import { CreateCorridaInput, UpdateCorridaInput } from "../schemas/corrida.schema";

import util from '../util';
import { firebase } from "./firebase";
import { MulticastMessage } from "firebase-admin/messaging";

export const createCorrida = async (input: CreateCorridaInput): Promise<Corrida | null> => {
  let corrida = null;

  try {
    const {data, hora, ...rest} = input;
    const now = util.now();

    corrida = await prisma.corrida.create({
      data: {
        ...rest,
        createdAt: new Date(now),
        dataHora: new Date(`${input.data}T${input.hora}:00.000Z`),
        atualizacao: {
          create: {
            statusId: rest.statusId,
            createdAt: new Date(now),
          }
        }
      },
    })

  } catch (error) {
    console.log(error);
  }
  return corrida;
};

export const updateCorrida = async (input: UpdateCorridaInput) => {
  let corrida = null;

  try {
    const {
      quilometrosRodados,
      valorQuilometro,
      cliente,
      passageiro,
      embarque,
      desembarque,
      trajeto,
      statusId
    } = input;
    const now = util.now();

    corrida = await prisma.corrida.update({
      where: {id: input.id},
      data: {
        quilometrosRodados,
        valorQuilometro,
        cliente,
        passageiro,
        embarque,
        desembarque,
        trajeto,
        dataHora: new Date(`${input.data}T${input.hora}:00.000Z`),
        atualizacao: {
          create: {
            statusId: statusId,
            createdAt: new Date(now),
          }
        }
      },
    })
  } catch (error) {
    console.log(error)
  }

  return corrida;
}

export const setAtualizacao = async(corridaId: number, statusId: number) => {
  try {
    const now = util.now();

    await prisma.atualizacaoCorrida.create({
      data: {
        createdAt: new Date(now),
        corridaId: corridaId,
        statusId: statusId
      }
    })

  } catch (error) {
    console.log(error)
  }
}

export const getCorridas = async (options?: {status?: number, motoristaId?: number}): Promise<Corrida[]> => {
  let corridas: Corrida[] = [];
  try {
    const queryOptions: Prisma.CorridaFindManyArgs = {
      include: {
        motorista: true,
        motoristasInteressados: {
          include: {
            motorista: true
          },
        },
        motoristasNaoInteressados: {
          include: {
            motorista: true
          }
        },
        atualizacao: {
          include: {
            status: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    };
    
    if(options) {
      if(options.status !== undefined){
        queryOptions.where = {
          statusId: options.status
        };
      }
      if(options.motoristaId !== undefined)
      {
        queryOptions.where = {
          ...queryOptions.where,
          motoristaId: options.motoristaId
        };
      }
    }

    corridas = await prisma.corrida.findMany(queryOptions);
  } catch (error) {
    console.log(error);
  }
  return corridas;
};

export const getCorrida = async (id: number): Promise<Corrida | null> => {
  let corrida = null;
  try {
    corrida = await prisma.corrida.findFirst({
      where: { id: id },
      include: {
        motorista: true,
        motoristasInteressados: {
          include: {
            motorista: true
          },
        },
        motoristasNaoInteressados: {
          include: {
            motorista: true
          }
        },
        atualizacao: {
          include: {
            status: true
          }
        }
      }
    })
  } catch (error) {
    console.log(error);
  }
  return corrida;
};

export const connectMotorista = async (corridaId: number, motoristaId: number): Promise<Corrida | null> => {
  let corrida = null;
  try {
    const now = util.now();

    corrida = await prisma.corrida.update({
      where: { id: corridaId },
      data: {
        motorista: {
          connect: {
            id: motoristaId 
          }
        },
        status: {
          connect: {
            id: 4
          }
        },
        atualizacao: {
          create: {
            createdAt: new Date(now),
            statusId: 4,
          }
        }
      },
      include: {
        motorista: true,
        motoristasInteressados: {
          include: {
            motorista: true
          },
        },
        motoristasNaoInteressados: {
          include: {
            motorista: true
          }
        },
        atualizacao: {
          include: {
            status: true
          }
        }
      }
    });

    const motorista = await prisma.motorista.findFirst({
      where: {id: motoristaId},
      select: {token: true}
    })

    if(motorista && motorista.token) {
      const message: MulticastMessage = {
        data: {
          type: "alocation",
          agendamento: JSON.stringify(corrida),
          title: `Agendamento recebido (${corrida.id})`,
          body: 'Você foi selecionado!',
          largeBody: `\nVocê foi selecionado para atender ao agendamento ${corrida.id}.\nConfira seus agendamentos para obter mais informações.`
        },
        tokens: [motorista.token]
      }

      firebase.multicast(message);
    }

  } catch (error) {
    console.log(error);
  }
  return corrida;
}

export const addMotorista = async (corridaId: number, motoristaId: number, type: number) => {
  let result = false;
  try {
    switch(type) {
      // MotoristasInteressados
      case 1:
        // Get the next position/order based on the last register
        const maxOrder = await prisma.motoristaInteressado.findFirst({
          where: { corridaId: corridaId },
          orderBy: { order: 'desc' },
          select: { order: true }
        });
    
        const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

        await prisma.$transaction(async(prisma) => {
          const motorista = await prisma.motoristaNaoInteressado.findUnique({
            where: { motoristaId_corridaId: { corridaId, motoristaId }}
          })

          if(motorista) {
            await prisma.motoristaNaoInteressado.delete({
              where: { motoristaId_corridaId: { corridaId, motoristaId }}
            })
          }

          // Create a new motoristaInteressado
          await prisma.motoristaInteressado.create({
            data: {
              motoristaId: motoristaId,
              corridaId: corridaId,
              order: nextOrder
            }
          })
        })
        result = true
        break;

      // MotoristasNaoInteressados
      case 2:
        {
          // Get the next position/order based on the last register
          const maxOrder = await prisma.motoristaNaoInteressado.findFirst({
            where: { corridaId: corridaId },
            orderBy: { order: 'desc' },
            select: { order: true }
          });
      
          const nextOrder = maxOrder ? maxOrder.order + 1 : 1;

          await prisma.$transaction(async(prisma) => {
            const motorista = await prisma.motoristaInteressado.findUnique({
              where: { motoristaId_corridaId: { corridaId, motoristaId }}
            })

            if(motorista) {
              await prisma.motoristaInteressado.delete({
                where: { motoristaId_corridaId: { corridaId, motoristaId } }
              });
            }
  
            // Create a new motoristaInteressado
            await prisma.motoristaNaoInteressado.create({
              data: {
                motoristaId: motoristaId,
                corridaId: corridaId,
                order: nextOrder
              }
            });
          });

          result = true
        }

        break
    }

  } catch (error) {
    console.log(error)
  }

  return result;
}

export const updateStatus = async (corridaId: number, statusId: number) => {
  let corrida = null;
  try {
    const now = util.now();

    await prisma.$transaction(async(prisma) => {
      corrida = await prisma.corrida.update({
        where: {id: corridaId},
        data: {
          status: {
            connect: {
              id: statusId
            }
          },
          atualizacao: {
            create: {
              createdAt: new Date(now),
              statusId: statusId
            }
          }
        },
      })

      if(statusId === 8 && corrida && corrida.motoristaId) {
        await prisma.motorista.update({
          where: { id: corrida.motoristaId },
          data: { activeCorridaId: null }
        })
      }
    })
  } catch (error) {
    console.log(error);
  }
  return corrida;
}