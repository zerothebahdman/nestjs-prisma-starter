import * as Yup from 'yup';
export const LoginRequestSchema = Yup.object().shape({
  identifier: Yup.string().email().required(),
  password: Yup.string().required(),
});

export type LoginRequestDto = Yup.InferType<typeof LoginRequestSchema>;
