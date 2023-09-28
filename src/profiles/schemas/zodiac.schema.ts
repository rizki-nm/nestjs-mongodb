import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Zodiac {
  @Prop()
  name: string;

  @Prop()
  dateFrom: string;

  @Prop()
  dateTo: string;
}

export const ZodiacSchema = SchemaFactory.createForClass(Zodiac);
