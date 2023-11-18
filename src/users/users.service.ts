import { createHash } from 'crypto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return user;
    else
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    else
      throw new HttpException(
        'User with this ID does not exist',
        HttpStatus.NOT_FOUND,
      );
  }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUserById(userId: number, updatedUserData: UpdateUserDto) {
    const updatedUser = await this.usersRepository.update(
      { id: userId },
      updatedUserData,
    );

    const isUpdated = Boolean(updatedUser.affected);
    if (!isUpdated)
      throw new HttpException('User was not found.', HttpStatus.NOT_FOUND);

    return this.usersRepository.findOneBy({ id: userId });
  }

  async setActiveRefreshToken(userId: number, refreshToken: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const hashedRefreshToken = await bcrypt.hash(hash, 10);
    await this.usersRepository.update(userId, {
      hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId);

    const hash = createHash('sha256').update(refreshToken).digest('hex');

    if (!user.hashedRefreshToken)
      throw new HttpException('User was not found.', HttpStatus.NOT_FOUND);

    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) return user;
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  async deleteOneById(userId: number) {
    await this.usersRepository.delete(userId);
  }
}
