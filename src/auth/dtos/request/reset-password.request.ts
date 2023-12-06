import * as Yup from 'yup';
export const ResetPasswordRequestSchema = Yup.object().shape({
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')]),
  token: Yup.string().required(),
});

export type ResetPasswordRequestDto = Yup.InferType<
  typeof ResetPasswordRequestSchema
>;
