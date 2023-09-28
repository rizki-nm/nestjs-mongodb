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
import { CreateProfileDto } from './dto/request/create-profile.dto';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { ResponseDto } from './dto/response/response.dto';
import { DataFormatDto } from './dto/response/data-format.dto';
import { Profile } from './schemas/profile.schema';

@Controller('profile')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiTags('User Profile')
  @ApiOperation({ summary: 'Create profile' })
  @ApiCreatedResponse({
    description: 'Profile has been updated',
    type: ResponseDto,
    isArray: true,
  })
  @UseGuards(AuthGuard())
  @Post()
  async createBook(
    @Body()
    profileReq: CreateProfileDto,
    @Req() req,
  ): Promise<ResponseDto<DataFormatDto>> {
    try {
      const profileData = await this.profilesService.create(
        profileReq,
        req.user,
      );

      const responseData: DataFormatDto = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        horoscope: profileData.horoscope,
        zodiac: profileData.zodiac,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseDto<DataFormatDto>(
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
  @ApiOkResponse({
    description: 'Profile has been updated',
    type: ResponseDto,
    isArray: true,
  })
  @UseGuards(AuthGuard())
  @Put()
  async updateProfile(
    @Body()
    profileReq: UpdateProfileDto,
    @Req() req,
  ): Promise<ResponseDto<DataFormatDto>> {
    try {
      const profileData: Profile = await this.profilesService.updateById(
        profileReq,
        req.user,
      );

      const responseData: DataFormatDto = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        horoscope: profileData.horoscope,
        zodiac: profileData.zodiac,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseDto<DataFormatDto>(
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
  @ApiOkResponse({
    description: 'Success get profile data',
    type: ResponseDto,
    isArray: true,
  })
  @UseGuards(AuthGuard())
  @Get()
  async getProfile(@Req() req): Promise<ResponseDto<DataFormatDto>> {
    try {
      const profileData: Profile = await this.profilesService.findById(
        req.user,
      );

      const responseData: DataFormatDto = {
        name: profileData.name,
        gender: profileData.gender,
        birthday: profileData.birthday,
        horoscope: profileData.horoscope,
        zodiac: profileData.zodiac,
        height: profileData.height,
        weight: profileData.weight,
        interest: profileData.interest,
      };

      return new ResponseDto<DataFormatDto>(
        'Success get profile data',
        HttpStatus.OK,
        responseData,
      );
    } catch (err) {
      throw new NotFoundException('Profile not found.');
    }
  }
}
