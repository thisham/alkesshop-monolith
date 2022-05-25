import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";
import Cookies from "cookies";

type ResponseDataType = {
  message: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "GET":
      const cookies = new Cookies(req, res);
      const jwtoken = cookies.get("token");
      if (!jwtoken) {
        res.status(401).json({ message: "unauthorized" });
        return;
      }

      cookies.set("token", null, { path: "/" });
      res.status(204).json({ message: "no content" });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
