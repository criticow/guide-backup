-- CreateTable
CREATE TABLE "Motorista" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "cnh" TEXT NOT NULL,
    "token" TEXT,
    "senha" TEXT,
    "activeCorridaId" INTEGER,
    "veiculoId" INTEGER,
    "online" BOOLEAN NOT NULL,

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corrida" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "notificatedAt" TIMESTAMP(3),
    "cliente" TEXT NOT NULL,
    "passageiro" TEXT NOT NULL,
    "motoristaId" INTEGER,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "valorQuilometro" INTEGER NOT NULL,
    "quilometrosRodados" INTEGER NOT NULL,
    "embarque" TEXT NOT NULL,
    "desembarque" TEXT NOT NULL,
    "trajeto" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Corrida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtualizacaoCorrida" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "corridaId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "AtualizacaoCorrida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotoristaInteressado" (
    "motoristaId" INTEGER NOT NULL,
    "corridaId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "MotoristaInteressado_pkey" PRIMARY KEY ("motoristaId","corridaId")
);

-- CreateTable
CREATE TABLE "MotoristaNaoInteressado" (
    "motoristaId" INTEGER NOT NULL,
    "corridaId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "MotoristaNaoInteressado_pkey" PRIMARY KEY ("motoristaId","corridaId")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "place" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusCorrida" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "StatusCorrida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "MotoristaInteressado_motoristaId_corridaId_key" ON "MotoristaInteressado"("motoristaId", "corridaId");

-- CreateIndex
CREATE UNIQUE INDEX "MotoristaNaoInteressado_motoristaId_corridaId_key" ON "MotoristaNaoInteressado"("motoristaId", "corridaId");

-- AddForeignKey
ALTER TABLE "Motorista" ADD CONSTRAINT "Motorista_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusCorrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtualizacaoCorrida" ADD CONSTRAINT "AtualizacaoCorrida_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtualizacaoCorrida" ADD CONSTRAINT "AtualizacaoCorrida_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusCorrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoristaInteressado" ADD CONSTRAINT "MotoristaInteressado_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoristaInteressado" ADD CONSTRAINT "MotoristaInteressado_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoristaNaoInteressado" ADD CONSTRAINT "MotoristaNaoInteressado_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotoristaNaoInteressado" ADD CONSTRAINT "MotoristaNaoInteressado_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
