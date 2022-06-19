import { ProductCategory } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma-orm";

type ResponseDataType = {
  message: string;
  data?: ProductCategory;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      const productCategory = await prisma.productCategory.findFirst({
        where: { id: Number(id) },
      });

      if (!productCategory) {
        res.status(404).json({ message: "not found" });
        return;
      }
      res.status(200).json({ message: "ok", data: productCategory });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
