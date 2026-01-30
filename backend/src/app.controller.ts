import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { User } from './users/users.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard)
  @Get()
  getHello(@Req() request: RequestWithUser) {
    return {
      id: request.user.id,
      username: request.user.username,
      roles: request.user.roles,
      status: request.user.status,
    };
  }
}
