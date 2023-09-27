import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseFormat } from './format/response.format';
import { DataFormat } from './format/data.format';
import { Profile } from './schemas/profile.schema';

@Controller('profile')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiTags('User Profile')
  @ApiOperation({ summary: 'Create profile' })
  @ApiCreatedResponse({ description: 'Profile has been created' })
  @UseGuards(AuthGuard())
  @Post()
  async createBook(
    @Body()
    profile: CreateProfileDto,
    @Req() req,
  ): Promise<ResponseFormat<DataFormat>> {
    try {
      const profileData = await this.profilesService.create(profile, req.user);

      const responseData: DataFormat = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseFormat<DataFormat>(
        'Profile has been created',
        HttpStatus.CREATED,
        responseData,
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  @ApiTags('User Profile')
  @ApiOperation({ summary: 'Update profile' })
  @ApiCreatedResponse({ description: 'Profile has been updated' })
  @UseGuards(AuthGuard())
  @Put()
  async updateProfile(
    @Body()
    profileReq: UpdateProfileDto,
    @Req() req,
  ): Promise<ResponseFormat<DataFormat>> {
    try {
      const profileData: Profile = await this.profilesService.updateById(
        profileReq,
        req.user,
      );

      const responseData: DataFormat = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseFormat<DataFormat>(
        'Profile has been updated',
        HttpStatus.OK,
        responseData,
      );
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  @ApiTags('User Profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({ description: 'Success get profile data' })
  @UseGuards(AuthGuard())
  @Get()
  async getProfile(@Req() req): Promise<ResponseFormat<DataFormat>> {
    try {
      const profileData: Profile = await this.profilesService.findById(
        req.user,
      );

      const responseData: DataFormat = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseFormat<DataFormat>(
        'Success get profile data',
        HttpStatus.OK,
        responseData,
      );
    } catch (err) {
      throw new NotFoundException('Profile not found.');
    }
  }
}
