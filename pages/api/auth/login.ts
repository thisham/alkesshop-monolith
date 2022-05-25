import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";
import Cookies from "cookies";
import prisma from "../../../utils/prisma-orm";

type ResponseDataType = {
  message: string;
  token?: string;
};

interface LoginRequestType extends NextApiRequest {
  body: {
    username: string;
    password: string;
  };
}

export default async function handler(
  req: LoginRequestType,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "POST":
      const userdata = await prisma.user.findFirst({
        where: {
          username: req.body.username,
        },
      });

      if (!userdata) {
        res.status(401).json({ message: "username not yet registered" });
        return;
      }

      const isCorrectUser = bcrypt.compare(
        req.body.password,
        userdata.password
      );
      if (!isCorrectUser) {
        res.status(401).json({ message: "password incorrect" });
        return;
      }

      const jwtoken = jwt.sign({ id: userdata.id }, jwtSecret, {
        expiresIn: "1d",
      });
      const cookies = new Cookies(req, res);
      cookies.set("token", jwtoken, { httpOnly: true });
      res.status(201).json({
        message: "created",
        token: jwtoken,
      });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
