import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Horoscope {
  @Prop()
  name: string;

  @Prop()
  alias: string;

  @Prop()
  dateFrom: string;

  @Prop()
  dateTo: string;
}

export const HoroscopeSchema = SchemaFactory.createForClass(Horoscope);
