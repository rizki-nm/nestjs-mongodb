import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Gender } from '../schemas/profile.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(Gender, { message: 'Please enter correct gender.' })
  readonly gender: Gender;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly birthday: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'Height must be a number.' })
  readonly height: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number.' })
  readonly weight: number;

  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  @IsArray({ message: 'Interest must be array of strings' })
  readonly interest: string[];

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
