import { PaymentType, PrismaClient } from "@prisma/client";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";

interface UserIDJwtPayload extends JwtPayload {
  id: string;
}

type UserData = {
  username: string;
  fullname: string;
  address: string;
  phone: string;
  paypal_id: string;
};

type ResponseDataType = {
  message: string;
  data?: UserData;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  const cookies = new Cookies(req, res);
  const jwtoken = cookies.get("token");
  const isTokenValid = jwt.verify(jwtoken ?? "", jwtSecret);
  if (!jwtoken || !isTokenValid) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  const jwtokenData = <UserIDJwtPayload>jwt.decode(jwtoken, { json: true });

  // controllers
  switch (req.method) {
    case "GET":
      const user = await prisma.user.findFirst({
        where: { id: jwtokenData.id },
      });

      if (!user) {
        res.status(404).json({ message: "not found" });
        break;
      }

      res.status(200).json({
        message: "ok",
        data: {
          username: user.username,
          fullname: user.fullname,
          address: user.address,
          phone: user.phone,
          paypal_id: user.paypalID,
        },
      });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
