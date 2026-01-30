import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { UserStatus } from '../users/user-status.enum';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const username = request.headers['token'] as string | undefined;

    if (!username) {
      throw new UnauthorizedException('Token header is missing');
    }

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === UserStatus.Deleted) {
      throw new UnauthorizedException('User deleted');
    }

    request.user = user;
    return true;
  }
}
