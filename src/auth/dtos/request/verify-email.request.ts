import * as Yup from 'yup';
export const VerifyUserEmailSchema = Yup.object().shape({
  token: Yup.string().required(),
});

export type VerifyUserEmailDto = Yup.InferType<typeof VerifyUserEmailSchema>;
