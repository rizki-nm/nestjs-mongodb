import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register' })
  @ApiCreatedResponse({ description: 'User has been created successfully.' })
  @Post('/register')
  register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.authService.register(registerDto);
  }

  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'User has been logged in' })
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
