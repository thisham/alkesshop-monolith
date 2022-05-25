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

type InvoiceData = {
  id: string;
  payment_total: number;
  payment_method: string;
  bank_name: string;
  user: {
    username: string;
    fullname: string;
    address: string;
    phone: string;
    paypal_id: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  created_at: Date;
  updated_at: Date;
};

type ResponseDataType = {
  message: string;
  data?: InvoiceData;
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
      const { id } = req.query;
      const invoiceRecord = await prisma.shoppingReport.findFirst({
        where: { id: Number(id) },
        include: {
          user: true,
          shoppingReportProductUserPivot: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!invoiceRecord) {
        res.status(404).json({ message: "not found" });
        return;
      }
      const invoice: InvoiceData = {
        id: String(invoiceRecord.id).padStart(5, "0"),
        payment_total: invoiceRecord.totalPayment,
        payment_method: invoiceRecord.paymentType,
        bank_name: invoiceRecord.bankName ?? "-",
        user: {
          username: invoiceRecord.user.username,
          fullname: invoiceRecord.user.fullname,
          address: invoiceRecord.user.address,
          phone: invoiceRecord.user.phone,
          paypal_id: invoiceRecord.user.paypalID,
        },
        products: [],
        created_at: invoiceRecord.createdAt,
        updated_at: invoiceRecord.updatedAt,
      };

      invoiceRecord.shoppingReportProductUserPivot.map((pivot) =>
        invoice.products.push({
          id: String(pivot.productID).padStart(3, "0"),
          name: pivot.product.name,
          price: pivot.product.price,
          quantity: pivot.quantity,
          total: pivot.price,
        })
      );

      res.status(200).json({ message: "ok", data: invoice });
      break;

    default:
      res.status(501).json({ message: "unimplemented" });
      break;
  }
}
