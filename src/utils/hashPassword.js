import bycrypt from "bcrypt";
import "dotenv/config";
export const createHash = (password) => {
  return bycrypt.hashSync(
    password,
    bycrypt.genSaltSync(parseInt(process.env.SALT))
  );
};

export const isValidPassword = (password, usePassword) => {
  return bycrypt.compareSync(password, usePassword);
};
