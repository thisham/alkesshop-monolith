import { NextApiRequest, NextApiResponse } from "next";
import { Gender, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";
import { randomUUID } from "crypto";
import Cookies from "cookies";

type ResponseDataType = {
  message: string;
  token?: string;
};

interface RegisterRequestType extends NextApiRequest {
  body: {
    username: string;
    fullname: string;
    password: string;
    passwordConfirmation: string;
    email: string;
    birthDate: Date;
    gender: string;
    address: string;
    city: string;
    phone: string;
    paypalID: string;
  };
}

const prisma = new PrismaClient();

export default async function handler(
  req: RegisterRequestType,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "POST":
      const userdata = await prisma.user.findFirst({
        where: {
          username: req.body.username,
        },
      });

      if (userdata) {
        res.status(401).json({ message: "username was used" });
        return;
      }

      if (req.body.password !== req.body.passwordConfirmation) {
        res.status(400).json({ message: "password didn't confirmed" });
        return;
      }

      const candidateUuid = randomUUID();
      await prisma.user.create({
        data: {
          id: candidateUuid,
          fullname: req.body.fullname,
          username: req.body.username,
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          birthdate: new Date(req.body.birthDate),
          gender: req.body.gender === Gender.Male ? Gender.Male : Gender.Female,
          address: req.body.address,
          city: req.body.city,
          phone: req.body.phone,
          paypalID: req.body.paypalID,
        },
      });

      const jwtoken = jwt.sign({ id: candidateUuid }, jwtSecret, {
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
