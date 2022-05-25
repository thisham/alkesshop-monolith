import { ProductCategory } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma-orm";

type ResponseDataType = {
  message: string;
  data?: ProductCategory[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "GET":
      const productCategories = await prisma.productCategory.findMany();
      res.status(200).json({ message: "ok", data: productCategories });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
