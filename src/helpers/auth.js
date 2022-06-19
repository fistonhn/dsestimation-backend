import { config } from "dotenv";
import { verify } from "jsonwebtoken";
import { genSalt, hash } from "bcryptjs";

config();

const encryptPassword = async (password) => {
  const salt = await genSalt(12);
  const hashed = await hash(password, salt);
  return hashed;
};

const verifyLink = (token, secret) => {
  try {
    const data = verify(token, secret);
    return data;
  } catch (error) {
    return "Internal Server Error";
  }
};

export { encryptPassword, verifyLink };
