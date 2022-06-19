/* eslint-disable linebreak-style */
import jwt from "jsonwebtoken";
import { redisClient } from ".";

const signAccessToken = async (userInfo) => {
  try {
    const payload = {
      id: userInfo.id,
      role: userInfo.role,
      name: userInfo.name,
      company: userInfo?.company,
      managerId: userInfo?.managerId,
    };
    const token = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1y",
    });

    await redisClient.set(
      `accessToken-${payload.id.toString()}`,
      token.toString()
    );
    return token;
  } catch (error) {
    return error;
  }
};
const signNewAccessToken = async (userInfo) => {
  try {
    const payload = {
      id: userInfo.id,
      role: userInfo.role,
      name: userInfo.name,
      company: userInfo?.company,
      managerId: userInfo?.managerId,
    };
    const token = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    await redisClient.set(
      `accessToken-${payload.id.toString()}`,
      token.toString()
    );

    return token;
  } catch (error) {
    return error;
  }
};
const signRefreshToken = async (userInfo) => {
  try {
    const payload = {
      id: userInfo.id,
      role: userInfo.role,
      name: userInfo.name,
      company: userInfo?.company,
      managerId: userInfo?.managerId,
    };
    const token = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
    });
    await redisClient.set(
      `refreshToken-${payload.id.toString()}`,
      token.toString()
    );
    return token;
  } catch (error) {
    return error;
  }
};

// generate token for verify email
const generateTokenVerify = (userinfo) => {
  try {
    const payload = {
      name: userinfo.name,
      email: userinfo.email,
      password: userinfo.password,
    };
    const token = jwt.sign({ payload: payload }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return "Internal server error";
  }
};

// generate token for creating staff

const generateTokenCreateStaff = (userinfo) => {
  try {
    const payload = {
      name: userinfo.name,
      email: userinfo.email,
      password: userinfo.password,
      company: userinfo?.company,
      managerId: userinfo?.managerId,
    };
    const token = jwt.sign({ payload: payload }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return "Internal server error";
  }
};

export {
  signAccessToken,
  signRefreshToken,
  signNewAccessToken,
  generateTokenVerify,
  generateTokenCreateStaff,
};
