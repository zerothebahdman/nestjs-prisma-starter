import { AuthUser } from '../../src/auth/auth-user';

export const mockUser = (fields?: Partial<AuthUser>): AuthUser => ({
  firstName: 'Ahmet',
  middleName: null,
  lastName: 'Uysal',
  username: 'ahmet',
  avatar: null,
  birthDate: new Date('1998-09-21'),
  registrationDate: new Date(),
  email: 'auysal16@ku.edu.tr',
  id: 1,
  emailVerified: true,
  password: 'password',
  ...fields,
});
