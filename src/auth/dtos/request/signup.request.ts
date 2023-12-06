import * as Yup from 'yup';
export const signupRequestSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')]),
});

export type SignupRequestDto = Yup.InferType<typeof signupRequestSchema>;
