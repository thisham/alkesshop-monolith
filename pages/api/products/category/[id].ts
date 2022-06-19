import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../utils/prisma-orm";

type ResponseDataType = {
  message: string;
  data?: Product[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      const products = await prisma.product.findMany({
        where: { productCategoryID: Number(id) },
        include: { productCategory: true },
      });

      res.status(200).json({ message: "ok", data: products });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
