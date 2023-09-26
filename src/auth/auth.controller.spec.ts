import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Muzaki',
    email: 'muzaki@test.com',
  };

  const jwtToken = 'jwtToken';

  const mockAuthService = {
    register: jest.fn().mockResolvedValueOnce(jwtToken),
    login: jest.fn().mockResolvedValueOnce(jwtToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        username: 'Muzaki',
        email: 'muzaki@test.com',
        password: '12345678',
      };

      const result = await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginDto = {
        email: 'muzaki@test.com',
        password: '12345678',
      };

      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual(jwtToken);
    });
  });
});
