import { PaymentType, PrismaClient } from "@prisma/client";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../../../constants/environment";

// type Re

interface CartAddShoppingReportRequest extends NextApiRequest {
  body: {
    payment_type: PaymentType;
    bank_name?: string;
  };
}

interface UserIDJwtPayload extends JwtPayload {
  id: string;
}

type CartData = {
  shoppingReportID: number;
  productID: number;
  price: number;
  quantity: number;
};

type ResponseDataType = {
  message: string;
  data?: unknown;
};

const prisma = new PrismaClient();

export default async function handler(
  req: CartAddShoppingReportRequest,
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
      // list invoice
      break;

    case "POST":
      const carts = await prisma.cart.findMany({
        where: { userID: jwtokenData.id, checkedOutAt: null },
        include: { product: true },
      });

      const reportMetadata = await prisma.shoppingReport.create({
        data: {
          userID: jwtokenData.id,
          paymentType: req.body.payment_type,
          bankName: req.body.bank_name,
          totalPayment: carts.reduce(
            (temp, curr) => temp + curr.quantity * curr.product.price,
            0
          ),
        },
      });

      const reportItem: CartData[] = [];
      carts.map((cart) =>
        reportItem.push({
          shoppingReportID: reportMetadata.id,
          productID: cart.productID,
          price: cart.product.price * cart.quantity,
          quantity: cart.quantity,
        })
      );

      await prisma.shoppingReportProductUserPivot.createMany({
        data: reportItem,
      });

      await prisma.cart.updateMany({
        where: { userID: jwtokenData.id, checkedOutAt: null },
        data: { checkedOutAt: reportMetadata.createdAt },
      });

      res
        .status(201)
        .json({
          message: "created",
          data: { report_id: String(reportMetadata.id).padStart(5, "0") },
        });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
