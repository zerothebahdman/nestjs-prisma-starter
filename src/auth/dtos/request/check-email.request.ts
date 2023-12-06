import * as Yup from 'yup';
export const checkEmailSchema = Yup.object().shape({
  email: Yup.string().email().required().trim(),
});

export type CheckEmailRequestDto = Yup.InferType<typeof checkEmailSchema>;
