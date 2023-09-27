import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: mongoose.Model<Profile>,
  ) {}

  async create(profile: CreateProfileDto, user: User): Promise<Profile> {
    const existingData = await this.findById(user);

    if (existingData) {
      throw new BadRequestException(
        'Profile already exists for this user. Use update endpoint instead',
      );
    }

    const data = Object.assign(profile, { user: user._id });

    return await this.profileModel.create(data);
  }

  async updateById(profile: UpdateProfileDto, user: User): Promise<Profile> {
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
}
