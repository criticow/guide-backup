
export type Endereco = {
  codigo: number;
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
};

export type Telefone = {
  codigo: number;
};

export type Email = {
  codigo: number;
};

export type Motorista = {
  id: number;
  nome: string;
  cpf: string;
  whatsapp: string;
  cnh: string;
  activeCorridaId: number;
  online: boolean;
};

export type MotoristaInteressado = {
  motoristaId: number;
  corridaId: number;
  order: number;
  motorista: Motorista;
}

export type MotoristaNaoInteressado = MotoristaInteressado;

export type Corrida = {
  id: number;
  createdAt: string;
  cliente: string;
  passageiro: string;
  motorista: Motorista | null;
  motoristasInteressados: MotoristaInteressado[];
  motoristasNaoInteressados: MotoristaNaoInteressado[];
  interessado: boolean;
  naoInteressado: boolean;
  dataHora: string;
  data: string;
  horario: string;
  valorQuilometro: number;
  quilometrosRodados: number;
  embarque: string;
  desembarque: string;
  trajeto: string;
  statusId: number;
}