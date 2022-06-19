import {
  signAccessToken,
  signRefreshToken,
  signNewAccessToken,
  generateTokenVerify,
  generateTokenCreateStaff
} from "./jwt_helper";
import {
  emailVerifytURL,
  confirmUserTemplate,
  forgotPasswordTemplate,
  passwordResetURL,
  confirmStaffTemplate,
  emailVerifytStaffURL,
} from "./email";

import { encryptPassword, verifyLink } from "./auth";
import redisClient from "./redis_config";

export {
  signAccessToken,
  signRefreshToken,
  signNewAccessToken,
  generateTokenVerify,
  emailVerifytURL,
  emailVerifytStaffURL,
  confirmUserTemplate,
  confirmStaffTemplate,
  forgotPasswordTemplate,
  passwordResetURL,
  encryptPassword,
  verifyLink,
  redisClient,
  generateTokenCreateStaff,
};
