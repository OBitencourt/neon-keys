import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "A password é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(8, "A password deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Precisa de pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Precisa de pelo menos um número"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "Tens de aceitar os termos para continuar",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
