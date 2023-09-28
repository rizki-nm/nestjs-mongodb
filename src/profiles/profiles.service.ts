import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { CreateProfileDto } from './dto/request/create-profile.dto';
import { Horoscope } from './schemas/horoscope.schema';
import { Zodiac } from './schemas/zodiac.schema';
import { format } from 'date-fns';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: mongoose.Model<Profile>,
    @InjectModel(Horoscope.name)
    private horoscopeModel: mongoose.Model<Horoscope>,
    @InjectModel(Zodiac.name)
    private zodiacModel: mongoose.Model<Zodiac>,
  ) {}

  async create(profileReq: CreateProfileDto, user: User): Promise<Profile> {
    // Check if exist data, use endpoint update instead
    const existingData = await this.findById(user);

    if (existingData) {
      throw new BadRequestException(
        'Profile already exists for this user. Use update endpoint instead',
      );
    }

    // Check if exist data, use endpoint update instead
    this.formatDate(profileReq.birthday, 'yyyy-mm-dd');

    const { horoscope, zodiac } = await this.getHoroscopeAndZodiacValue(
      profileReq.birthday,
    );

    const profile: Profile = {
      ...profileReq,
      horoscope,
      zodiac,
    };

    const res = Object.assign(profile, { user: user._id });

    return await this.profileModel.create(res);
  }

  async updateById(profileReq: UpdateProfileDto, user: User): Promise<Profile> {
    const { horoscope, zodiac } = await this.getHoroscopeAndZodiacValue(
      profileReq.birthday,
    );

    const profile: Profile = {
      ...profileReq,
      horoscope,
      zodiac,
    };

    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { user },
      profile,
      { new: true, runValidators: true },
    );

    if (!updatedProfile) {
      throw new NotFoundException('Profile Not Found');
    }

    return updatedProfile;
  }

  async findById(user: User): Promise<Profile> {
    const profile = await this.profileModel.findOne({ user });

    if (!profile) {
      return;
    }

    return profile;
  }

  private async getHoroscopeAndZodiacValue(birthday: string) {
    const horoscope = await this.getHoroscopeValue(birthday);
    const zodiac = await this.getZodiacValue(birthday);

    return { horoscope, zodiac };
  }

  private async getHoroscopeValue(birthday: string) {
    const horoscopeData = await this.horoscopeModel.find().exec();
    const birthdayDate = new Date(birthday);
    const birthdayMonthDay = `${(birthdayDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${birthdayDate.getDate().toString().padStart(2, '0')}`;

    const horoscopeSign = horoscopeData.find((horoscope) => {
      const dateFrom = horoscope.dateFrom; // Assumes 'mm-dd' format
      const dateTo = horoscope.dateTo; // Assumes 'mm-dd' format

      return (
        (birthdayMonthDay >= dateFrom && birthdayMonthDay <= dateTo) ||
        (birthdayMonthDay >= dateFrom && dateTo < dateFrom) // Handle cases across year boundary
      );
    });

    return horoscopeSign ? horoscopeSign.name : 'Unknown';
  }

  private async getZodiacValue(birthday: string) {
    const zodiacData = await this.zodiacModel
      .findOne({
        dateFrom: { $lte: birthday }, // Zodiac sign start date is less than or equal to birthday
        dateTo: { $gte: birthday }, // Zodiac sign end date is greater than or equal to birthday
      })
      .exec();

    return zodiacData ? zodiacData.name : 'Unknown';
  }

  private formatDate(birthday: string, formatReq: string): string {
    const birthdayDate = new Date(birthday);

    // Format the date using date-fns
    return format(birthdayDate, formatReq);
  }
}
