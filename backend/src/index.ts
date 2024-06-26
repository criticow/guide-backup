import express from 'express'
import cors from 'cors'
import { firebase } from './services/firebase';
import router from './routes';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import prisma from './db/client';
import { getTokens } from './services/motorista.service';
import { MulticastMessage } from 'firebase-admin/messaging';
import util from './util';

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(router)

const PORT = 3001;

firebase.init();

const job = CronJob.from({
  cronTime: '0 * * * * *',
  start: true,
  onTick: async () => {
    const format = "yyyy-MM-dd'T'HH:mm':00.000Z'";
    const now = DateTime.now().setZone("America/Sao_Paulo");
    const threshold = now.plus({ hours: 1 });
    const notificationThreshold = now.minus({minutes: 5});

    let start = now.toFormat(format);
    let end = threshold.toFormat(format);
    let notificationEnd = notificationThreshold.toFormat(format);

    // Get the agendamentos that dont have any motoristaInteressado and are between 1 hour to reach the dataHora
    const corridas = await prisma.corrida.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                notificatedAt: { equals: null }
              },
              {
                notificatedAt: {
                  lte: new Date(notificationEnd)
                }
              },
            ]
          },
          {
            OR: [
              {
                motoristaId: {not: null}
              },
              {
                motoristasInteressados: { none: {} }
              }
            ]
          },
          {
            dataHora: {
              gte: new Date(start)
            },
          },
          {
            dataHora: {
              lte: new Date(end)
            }
          }
        ]
      }
    })

    if(corridas.length === 0) {
      return;
    }

    const motoristas = await getTokens();
    const tokens = [...new Set(motoristas.map((motorista) => motorista.token))] as string[];

    corridas.forEach(async(corrida) => {
      const nowISO = util.now();

      try {
        await prisma.corrida.update({
          where: {id: corrida.id},
          data: {notificatedAt: new Date(nowISO)}
        })
      } catch (error) {
        console.log(error);
      }

      // Send only for the motorista from the corrida
      if(corrida.motoristaId) {
        const motorista = await prisma.motorista.findFirst({
          where: {
            id: corrida.motoristaId,
            token: { not: null }
          },
          select: { token: true, activeCorridaId: true }
        });

        // Only if the agendamento is not currently active
        if(motorista && motorista.activeCorridaId !== corrida.id) {
          const message: MulticastMessage = {
            data: {
              type: "aviso-vencimento-unico",
              agendamento: JSON.stringify(corrida),
              title: `Agendamento vencendo (${corrida.id})`,
              body: `Confira seus agendamentos!`,
              largeBody:
              `\nVocê tem um agendamento faltando menos de uma hora para vencer.`+
              `\nInicie o agendamento para não receber mais avisos.`
            },
            tokens: [motorista.token as string]
          }

          firebase.multicast(message);
        }

        return;
      }

      if(tokens.length > 0) {
        const message: MulticastMessage = {
          data: {
            type: "aviso-vencimento-geral",
            agendamento: JSON.stringify(corrida),
            title: `Agendamento vencendo (${corrida.id})`,
            body: `Ver agendamento`,
            largeBody:
            `\nExiste um agendamento faltando menos de uma hora para vencer e nenhum motorista demonstrou interesse.` +
            `\nPressione para ver agendamento!`
          },
          tokens
        }

        firebase.multicast(message);
      }
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});