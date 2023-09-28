import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './schemas/profile.schema';
import { HoroscopeSchema } from './schemas/horoscope.schema';
import { ZodiacSchema } from './schemas/zodiac.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
      { name: 'Horoscope', schema: HoroscopeSchema },
      { name: 'Zodiac', schema: ZodiacSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
