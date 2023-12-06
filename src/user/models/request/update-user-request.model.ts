import * as Yup from 'yup';

export const UpdateUserRequestSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')]),
  birth_date: Yup.date().required(),
});

export type UpdateUserRequestDto = Yup.InferType<
  typeof UpdateUserRequestSchema
>;
