import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignupRequestDto } from 'src/auth/dtos/request';
import { createUser } from './utils/mock-user';
import { faker } from '@faker-js/faker';
import { sleep } from './utils/helper';

describe('AuthController Integration', () => {
  let app: { init: () => any; close: () => any; getHttpServer: () => any };
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.user.deleteMany();
    await prisma.token.deleteMany();
  });

  describe('/auth/signup POST', () => {
    it('should return 400 if email is not provided', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('email is a required field');
    });

    it('should create a new user', async () => {
      const signupRequest: SignupRequestDto = {
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: 'password',
        confirmPassword: 'password',
      };

      const user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.CREATED);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Signup Successful');
    });

    it('should return 400 if email is already in use', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.CREATED);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Signup Successful');

      const user2 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(user2).toBeDefined();
      expect(user2.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user2.body).toBeDefined();
      expect(user2.body.message).toBe('Email is already taken');
    });
  });

  describe('/auth/login POST', () => {
    it('should return 400 if email is not provided', async () => {
      const loginRequest = {
        identifier: '',
        password: 'password',
      };

      const user = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('identifier is a required field');
    });

    it('should return 400 if password is not provided', async () => {
      const loginRequest = {
        identifier: faker.internet.email(),
        password: '',
      };

      const user = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('password is a required field');
    });

    it('should return 400 if password is incorrect', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const user = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.CREATED);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Signup Successful');

      const loginRequest = {
        identifier: signupRequest.email,
        password: 'password2',
      };

      const user2 = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginRequest);

      expect(user2).toBeDefined();
      expect(user2.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user2.body).toBeDefined();
      expect(user2.body.message).toBe('Invalid email or password');
    });
  });

  describe('/auth/verify POST', () => {
    it('should return 400 if token is not provided', async () => {
      const verifyRequest = {
        token: '',
      };

      const user = await request(app.getHttpServer())
        .post('/auth/verify')
        .send(verifyRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('token is a required field');
    });

    it('should return 400 if token is invalid', async () => {
      const verifyRequest = {
        token: 'invalid-token',
      };

      const user = await request(app.getHttpServer())
        .post('/auth/verify')
        .send(verifyRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Oops!, invalid token');
    });

    it('should return 400 if token is expired', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(signup).toBeDefined();
      expect(signup.status).toBe(HttpStatus.CREATED);
      expect(signup.body).toBeDefined();
      expect(signup.body.message).toBe('Signup Successful');

      const verifyRequest = {
        token: faker.random.alphaNumeric(6),
      };

      const user2 = await request(app.getHttpServer())
        .post('/auth/verify')
        .send(verifyRequest);

      expect(user2).toBeDefined();
      expect(user2.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user2.body).toBeDefined();
      expect(user2.body.message).toBe('Oops!, invalid token');
    });

    it('should verify user email', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);
      console.log(signup.body);
      expect(signup).toBeDefined();
      expect(signup.status).toBe(HttpStatus.CREATED);
      expect(signup.body).toBeDefined();
      expect(signup.body.message).toBe('Signup Successful');
      expect(signup.body.token).toBeDefined();

      const user2 = await request(app.getHttpServer())
        .post('/auth/verify')
        .send({ token: signup.body.token });

      expect(user2).toBeDefined();
      expect(user2.status).toBe(HttpStatus.OK);
      expect(user2.body).toBeDefined();
      expect(user2.body.message).toBe('Email Verified Successfully');
    });
  });

  describe('/auth/resend-verification POST', () => {
    // it('should return 400 if email is not provided', async () => {
    //   const resendRequest = {
    //     email: '',
    //   };
    //   console.log(resendRequest);
    //   const req = await request(app.getHttpServer())
    //     .post('/auth/resend-verification')
    //     .send(resendRequest);
    //   await sleep(100);
    //   expect(req).toBeDefined();
    //   expect(req.status).toBe(HttpStatus.BAD_REQUEST);
    //   expect(req.body).toBeDefined();
    //   expect(req.body.message).toBe('email is a required field');
    // });

    it('should return 400 if email is invalid', async () => {
      const resendRequest = {
        email: faker.internet.email(),
      };

      const user = await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send(resendRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.BAD_REQUEST);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Oops!, user does not exist');
    });

    it('should resend verification email', async () => {
      const signupRequest: SignupRequestDto = createUser();

      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupRequest);

      expect(signup).toBeDefined();
      expect(signup.status).toBe(HttpStatus.CREATED);
      expect(signup.body).toBeDefined();
      expect(signup.body.message).toBe('Signup Successful');

      // implement a sleep function
      await sleep(200);

      const resendRequest = {
        email: signupRequest.email,
      };

      const user = await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send(resendRequest);

      expect(user).toBeDefined();
      expect(user.status).toBe(HttpStatus.OK);
      expect(user.body).toBeDefined();
      expect(user.body.message).toBe('Verification mail sent successfully');
    });
  });
});
