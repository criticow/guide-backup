import { TypeOf, number, object, string } from "zod";

export const createCorridaSchema = object({
  body: object({
    data: string({ required_error: "dataHora é obrigatório"}).min(10, "data deve conter 10 digitos"),
    hora: string({ required_error: "hora é obrigatório"}).min(5, "hora deve conter 5 digitos"),
    cliente: string({ required_error: "cliente é obrigatório" }),
    passageiro: string({ required_error: "passageiro é obrigatório" }),
    embarque: string({ required_error: "embarque é obrigatório" }),
    desembarque: string({ required_error: "desembarque é obrigatório" }),
    trajeto: string({ required_error: "trajeto é obrigatório" }),
    valorQuilometro: number({ required_error: "valorQuilometro é obrigatório"}),
    quilometrosRodados: number({ required_error: "quilometrosRodados é obrigatório"}),
    statusId: number({ required_error: "status é obrigatório"}),
  }),
});

export const updateCorridaSchema = object({
  body: object({
    id: number({required_error: "id é obrigatório"}),
    data: string({ required_error: "dataHora é obrigatório"}).min(10, "data deve conter 10 digitos"),
    hora: string({ required_error: "hora é obrigatório"}).min(5, "hora deve conter 5 digitos"),
    cliente: string({ required_error: "cliente é obrigatório" }),
    passageiro: string({ required_error: "passageiro é obrigatório" }),
    embarque: string({ required_error: "embarque é obrigatório" }),
    desembarque: string({ required_error: "desembarque é obrigatório" }),
    trajeto: string({ required_error: "trajeto é obrigatório" }),
    valorQuilometro: number({ required_error: "valorQuilometro é obrigatório"}),
    quilometrosRodados: number({ required_error: "quilometrosRodados é obrigatório"}),
    statusId: number({ required_error: "status é obrigatório"}),
  }),
});

export const connectMotoristaSchema = object({
  body: object({
    corridaId: number({required_error: 'corridaId é obrigatório'}),
    motoristaId: number({required_error: 'motoristaId é obrigatório'}),
  }),
})

export const updateStatusSchema = object({
  body: object({
    corridaId: number({required_error: 'corridaId é obrigatório'}),
    statusId: number({ required_error: "status é obrigatório"}),
  })
})

export type CreateCorridaInput = TypeOf<typeof createCorridaSchema>['body'];
export type UpdateCorridaInput = TypeOf<typeof updateCorridaSchema>['body'];
export type ConnectMotoristaInput = TypeOf<typeof connectMotoristaSchema>['body'];
export type UpdateStatusInput = TypeOf<typeof updateStatusSchema>['body'];