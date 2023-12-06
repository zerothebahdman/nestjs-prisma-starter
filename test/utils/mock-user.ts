import { faker } from '@faker-js/faker';
import { AuthUser } from '../../src/auth/auth-user';
const password = faker.internet.password();
export const createUser = (fields?: Partial<AuthUser>) => ({
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: password,
  confirmPassword: password,
  ...fields,
});
