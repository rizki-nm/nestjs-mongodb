import { ApiProperty } from '@nestjs/swagger';

export class DataFormatDto {
  @ApiProperty({ type: String })
  readonly name: string;

  @ApiProperty({ type: String })
  readonly gender: string;

  @ApiProperty({ type: String })
  readonly birthday: string;

  @ApiProperty({ type: String })
  readonly horoscope: string;

  @ApiProperty({ type: String })
  readonly zodiac: string;

  @ApiProperty({ type: Number })
  readonly height: number;

  @ApiProperty({ type: Number })
  readonly weight: number;

  @ApiProperty({ type: String, isArray: true })
  readonly interest: string[];
}
