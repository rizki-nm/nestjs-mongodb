import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
