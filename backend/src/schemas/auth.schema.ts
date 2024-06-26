import { TypeOf, object, string } from "zod";

export const loginSchema = object({
  body: object({
    cpf: string({
      required_error: "cpf é obrigatório"
    }).min(11, "cpf deve conter 11 digitos"),
    senha: string({
      required_error: "senha é obrigatório"
    })
  }),
});

export const registerSchema = object({
  body: object({
    cpf: string({
      required_error: "cpf é obrigatório"
    }).min(11, "cpf deve conter 11 digitos"),
    dataNascimento: string({
      required_error: "dataNascimento é obrigatório"
    }).min(10, "dataNascimento deve conter 10 digitos"),
    senha: string({
      required_error: "senha é obrigatório"
    })
  })
})

export type LoginInput = TypeOf<typeof loginSchema>['body'];
export type RegisterInput = TypeOf<typeof registerSchema>['body'];