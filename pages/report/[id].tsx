import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FC, FormEvent, MouseEvent, useEffect, useState } from "react";
import RegularButton from "../../components/buttons/RegularButton";
import DataCard from "../../components/cards/DataCard";
import ProductDisplayLayout from "../../components/layouts/ProductDisplayLayout";
import CheckoutModal from "../../components/modals/CheckoutModal";

type ReportData = {
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

type Response = { message: string; data: ReportData };

function useLogic() {
  const [report, setReport] = useState<ReportData>();
  const route = useRouter();
  const { id } = route.query;

  useEffect(() => {
    const handleUnauthenticated = () => {
      const isLoggedIn = Boolean(Cookies.get("loggedIn"));
      if (!isLoggedIn) {
        route.push("/");
        return;
      }
    };

    handleUnauthenticated();
  }, [route]);

  useEffect(() => {
    const fetchReport = async () => {
      const report: Response = await (
        await fetch(`/api/checkout/${id}`, { method: "GET" })
      ).json();
      setReport(report.data);
    };

    id && fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    states: {
      report,
    },
    utils: {},
  };
}

const CartPage: FC = () => {
  const { states, utils } = useLogic();

  return (
    <>
      <ProductDisplayLayout pageTitle="Laporan Belanja">
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-2xl mb-10">Laporan Belanja Anda</h1>

          <DataCard>
            <div className="mb-10 flex w-full">
              <table className="w-1/2">
                <tbody>
                  <tr>
                    <td className="w-1/4 font-bold">Username</td>
                    <td className="w-3/4">
                      {states.report?.user.username ?? ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">Nama Lengkap</td>
                    <td className="w-3/4">
                      {states.report?.user.fullname ?? ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">Alamat</td>
                    <td className="w-3/4">
                      {states.report?.user.address ?? ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">No. HP</td>
                    <td className="w-3/4">{states.report?.user.phone ?? ""}</td>
                  </tr>
                </tbody>
              </table>

              {/* column 2 */}
              <table className="w-1/2">
                <tbody>
                  <tr>
                    <td className="w-1/4 font-bold">Tanggal</td>
                    <td className="w-3/4">
                      {String(states.report?.created_at) ?? ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">ID Paypal</td>
                    <td className="w-3/4">
                      {states.report?.user.paypal_id ?? ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">Nama Bank</td>
                    <td className="w-3/4">{states.report?.bank_name ?? ""}</td>
                  </tr>
                  <tr>
                    <td className="w-1/4 font-bold">Cara Bayar</td>
                    <td className="w-3/4">
                      {states.report?.payment_method ?? ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table className="table-auto w-full rounded-lg overflow-hidden">
              <thead className="font-bold uppercase bg-slate-300">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Barang - ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Harga
                  </th>
                </tr>
              </thead>

              <tbody className="border-b">
                {states.report?.products && states.report?.products.length ? (
                  states.report?.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-center">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name} - {product.id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product.quantity * product.price}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center" colSpan={4}>
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="my-10 ml-5 font-bold text-lg">
              Total Belanja: {states.report?.payment_total ?? 0}
            </div>

            <div className="mt-5 mb-20 mr-20 text-right uppercase">
              Tanda Tangan Toko
            </div>
          </DataCard>
        </div>
      </ProductDisplayLayout>
    </>
  );
};

export default CartPage;
