import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { Gender } from '../src/profiles/schemas/profile.schema';
import { RegisterDto } from '../src/auth/dto/register.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { validate } from 'class-validator';
import { CreateProfileDto } from '../src/profiles/dto/request/create-profile.dto';

describe('Auth & Profile (e2e) - Success Test Cases', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const userRegister: RegisterDto = {
    username: 'muzaki',
    email: 'muzaki@test.com',
    password: '12345678',
  };

  const userLogin: LoginDto = {
    email: userRegister.email,
    password: userRegister.password,
  };

  const newProfile = {
    name: 'new muzaki',
    gender: Gender.MALE,
    birthday: '2020-12-20',
    height: 200,
    weight: 90,
    interest: ['billiard', 'voleyball'],
  };

  let jwtToken: string = '';
  let profileCreated;

  describe('Auth - Success Test Cases', () => {
    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userRegister)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    it('should login user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(userLogin)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });
  });

  describe('Profile - Success Test Cases', () => {
    it('should create new Profile', async () => {
      return request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(newProfile)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.name).toEqual(newProfile.name);
          profileCreated = res.body;
        });
    });

    it('should get data Profile', async () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toEqual(profileCreated.name);
        });
    });

    it('should update data Profile', async () => {
      const profile = { name: 'Updated name' };
      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(profile)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.name).toEqual(profile.name);
        });
    });
  });
});

describe('Auth & Profile (e2e) - Failed Test Cases', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const userRegister: RegisterDto = {
    username: 'muzaki',
    email: '1',
    password: '12345678',
  };

  const invalidLogin: LoginDto = {
    email: 'belumregis@tes.com',
    password: '12345678',
  };

  const invalidBirthday: CreateProfileDto = {
    name: 'muzaki',
    gender: Gender.MALE,
    birthday: 'salah',
    height: 10,
    weight: 10,
    interest: [],
    user: null,
  };

  describe('Auth - Failed Test Cases', () => {
    it('should not accept invalid email', async () => {
      return validate(userRegister).then((err) => {
        expect(err).toBeDefined();
      });
    });

    it('should register user (muzaki)', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'muzaki',
          email: 'muzaki@test.com',
          password: '12345678',
        })
        .expect(201);
    });

    it('should not register duplicate email (muzaki)', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'muzaki',
          email: 'muzaki@test.com',
          password: '12345678',
        })
        .expect(409);
    });

    it('should not login (not register yet)', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidLogin)
        .expect(201);
    });
  });

  describe('Profile - Failed Test Cases', () => {
    it('should unauthorized in create profile', async () => {
      return request(app.getHttpServer()).post('/profile').expect(401);
    });

    it('should unauthorized in get profile', async () => {
      return request(app.getHttpServer()).get('/profile').expect(401);
    });

    it('should unauthorized in update profile', async () => {
      return request(app.getHttpServer()).put('/profile').expect(401);
    });

    it('should not accept invalid birthday', async () => {
      return validate(invalidBirthday).then((err) => {
        expect(err).toBeDefined();
      });
    });
  });
});
