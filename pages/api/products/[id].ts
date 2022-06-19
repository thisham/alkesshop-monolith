import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma-orm";

type ProductData = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  created_at: Date;
  updated_at: Date;
};

type ResponseDataType = {
  message: string;
  data?: ProductData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseDataType>
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      const product = await prisma.product.findFirst({
        where: { id: Number(id) },
        include: { productCategory: true },
      });

      if (!product) {
        res.status(404).json({ message: "not found" });
        return;
      }

      const response: ProductData = {
        id: String(product.id).padStart(3, "0"),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.productCategory.name,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };

      res.status(200).json({ message: "ok", data: response });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
