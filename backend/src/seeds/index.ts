import prisma from "../db/client"

const main = async() => {
  try {
    
    await prisma.statusCorrida.upsert({where: {id: 1}, update: {}, create: {id: 1,  descricao: "Agendado"}});
    await prisma.statusCorrida.upsert({where: {id: 2}, update: {}, create: {id: 2,  descricao: "Disponível"}});
    await prisma.statusCorrida.upsert({where: {id: 3}, update: {}, create: {id: 3,  descricao: "Cancelado"}});
    await prisma.statusCorrida.upsert({where: {id: 4}, update: {}, create: {id: 4,  descricao: "Alocado"}});
    await prisma.statusCorrida.upsert({where: {id: 5}, update: {}, create: {id: 5,  descricao: "À caminho"}});
    await prisma.statusCorrida.upsert({where: {id: 6}, update: {}, create: {id: 6,  descricao: "Aguardando cliente"}});
    await prisma.statusCorrida.upsert({where: {id: 7}, update: {}, create: {id: 7,  descricao: "Em andamento"}});
    await prisma.statusCorrida.upsert({where: {id: 8}, update: {}, create: {id: 8,  descricao: "Finalizado"}});

  } catch (error) {
    console.log(error);
  }
}

main();
