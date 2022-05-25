import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";
import prisma from "../../../utils/prisma-orm";

// type Re

interface CartAddRequestType extends NextApiRequest {
  body: {
    product_id: string;
  };
}

interface UserIDJwtPayload extends JwtPayload {
  id: string;
}

type ProductData = {
  id: number;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

type ResponseData = {
  total_price: number;
  user_id: string;
  products: ProductData[];
};

type ResponseDataType = {
  message: string;
  data?: ResponseData;
};

export default async function handler(
  req: CartAddRequestType,
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
      const carts = await prisma.cart.findMany({
        where: { userID: jwtokenData.id, checkedOutAt: null },
        include: { product: true },
      });

      const productData: ProductData[] = [];

      carts.map((cart) =>
        productData.push({
          id: cart.id,
          product_id: String(cart.product.id).padStart(3, "0"),
          name: cart.product.name,
          quantity: cart.quantity,
          price: cart.product.price,
        })
      );

      const response: ResponseData = {
        total_price: carts.reduce(
          (temp, curr) => temp + curr.quantity * curr.product.price,
          0
        ),
        user_id: jwtokenData.id,
        products: productData,
      };

      res.status(200).json({ message: "ok", data: response });
      break;

    case "POST":
      const existingRecord = await prisma.cart.findFirst({
        where: {
          productID: Number(req.body.product_id),
          userID: jwtokenData.id,
          checkedOutAt: null,
        },
      });

      if (existingRecord) {
        await prisma.cart.update({
          where: { id: existingRecord.id },
          data: { quantity: existingRecord.quantity + 1 },
        });
      } else {
        await prisma.cart.create({
          data: {
            productID: Number(req.body.product_id),
            userID: jwtokenData.id,
            quantity: 1,
          },
        });
      }

      res.status(201).json({ message: "created" });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
