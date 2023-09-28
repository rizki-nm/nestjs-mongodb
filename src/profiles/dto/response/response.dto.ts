import { ApiProperty } from '@nestjs/swagger';
import { DataFormatDto } from './data-format.dto';

export class ResponseDto<T> {
  @ApiProperty({ type: String })
  message: string;
  @ApiProperty({ type: Number })
  code: number;
  @ApiProperty({ type: DataFormatDto })
  data: T;

  constructor(message: string, code: number, data: T) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
