import jwt from "jsonwebtoken";
import { Users } from "../database/models";
import { onError } from "../utils/response";
import { redisClient } from "../helpers";

export const verifyAccessToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return onError(res, 401, "Not Allowed");
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decod) => {
    if (error) {
      return onError(res, 401, "Token is incorrect or expired");
    } else {
      const response = await redisClient.get(`accessToken-${decod.payload.id}`);
      if (response) {
        req.user = decod.payload;
        return next();
      } else {
        return onError(res, 401, "Session is expired, login again!");
      }
    }
  });
};

// Check if user is verified or not function

export const isNotVerified = async (req, res, next) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      return onError(
        res,
        400,
        "User doesn't exist! If you have been registered, Please check you email to verify your account!"
      );
    } else if (user.isConfirmed) {
      return next();
    } else {
      return onError(
        res,
        401,
        "Your account has not been verified,Please check your email to Verify you email to continue!"
      );
    }
  } catch (error) {
    return onError(res, 500, "Internal server error");
  }
};
