import { TypeOf, boolean, number, object, string } from "zod";

export const createMotoristaSchema = object({
  body: object({
    nome: string({
      required_error: "Nome é obrigatório"
    }),
    cpf: string({
      required_error: "cpf é obrigatório"
    }).min(11, "cpf deve conter 11 digitos"),
    cnh: string({
      required_error: "cnh é obrigatório"
    }).min(11, "cnh deve conter 11 digitos"),
    whatsapp: string({
      required_error: "whatsapp é obrigatório"
    }).min(11, "whatsapp deve conter 11 digitos"),
    dataNascimento: string({
      required_error: "dataNascimento é obrigatório"
    }).min(10, "dataNascimento deve conter 10 digitos"),
  }),
});

export const addMotoristaSchema = object({
  body: object({
    corridaId: number({required_error: 'corridaId é obrigatório'}),
    motoristaId: number({required_error: 'motoristaId é obrigatório'}),
    type: number({required_error: 'type é obrigatório'})
  }),
});

export const changeStatusSchema = object({
  body: object({
    cpf: string({
      required_error: "cpf é obrigatório"
    }).min(11, "cpf deve conter 11 digitos"),
    online: boolean({
      required_error: "online é obrigatório"
    })
  })
})

export const registerTokenSchema = object({
  body: object({
    cpf: string({
      required_error: "cpf é obrigatório"
    }).min(11, "cpf deve conter 11 digitos"),
    token: string({
      required_error: "token é obrigatório"
    })
  })
})

export type CreateMotoristaInput = TypeOf<typeof createMotoristaSchema>["body"];
export type AddMotoristaInput = TypeOf<typeof addMotoristaSchema>["body"];
export type ChangeStatusInput = TypeOf<typeof changeStatusSchema>["body"];
export type RegisterTokenInput = TypeOf<typeof registerTokenSchema>["body"];