import { RoleType } from '../constants/role-type.constant';

export type AccessTokenPayload = {
  userId: number;
  role: RoleType;
};

export type RefreshTokenPayload = {
  userId: number;
};
