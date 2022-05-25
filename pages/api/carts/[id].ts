import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";
import prisma from "../../../utils/prisma-orm";

type ResponseDataType = {
  message: string;
};

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

  // controllers
  switch (req.method) {
    case "DELETE":
      const { id } = req.query;
      try {
        await prisma.cart.delete({
          where: { id: Number(id) },
        });

        res.status(204).json({ message: "no content" });
      } catch (error) {
        res.status(404).json({ message: "not found" });
      }
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
