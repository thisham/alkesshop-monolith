import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FC, FormEvent, useEffect, useState } from "react";
import RegularButton from "../../components/buttons/RegularButton";
import DataCard from "../../components/cards/DataCard";
import ProductDisplayLayout from "../../components/layouts/ProductDisplayLayout";
import CheckoutModal from "../../components/modals/CheckoutModal";

type CartData = {
  total_price: number;
  user_id: string;
  products: {
    id: number;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

type CheckoutMetadata = {
  payment_type: string;
  bank_name?: string;
};

type CheckoutResponse = {
  message: string;
  data: { report_id: string };
};

type Response = { message: string; data: CartData };

function useLogic() {
  const [cart, setCart] = useState<CartData>();
  const [isCheckoutModalShown, setIsCheckoutModalShown] =
    useState<boolean>(false);
  const [checkoutMetadata, setCheckoutMetadata] = useState<CheckoutMetadata>({
    payment_type: "",
  });
  const [isBankNameDisabled, setIsBankNameDisabled] = useState(true);
  const route = useRouter();

  const fetchCart = async () => {
    const cartDetail: Response = await (
      await fetch("/api/carts", { method: "GET" })
    ).json();
    setCart(cartDetail.data);
  };

  useEffect(() => {
    const isLoggedIn = Boolean(Cookies.get("loggedIn"));
    if (!isLoggedIn) {
      route.push("/");
      return;
    }

    fetchCart();
  }, [route]);

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCheckoutMetadata({
      ...checkoutMetadata,
      [event.currentTarget.name]: event.currentTarget.value,
    });

    if (
      event.currentTarget.name === "payment_type" &&
      event.currentTarget.value === "PREPAID"
    ) {
      setIsBankNameDisabled(false);
    } else if (event.currentTarget.name === "payment_type") {
      setCheckoutMetadata({
        payment_type: event.currentTarget.value,
        bank_name: undefined,
      });
      setIsBankNameDisabled(true);
    }
  };

  const checkoutHandler = () => {
    fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutMetadata),
    })
      .then((res) => res.json())
      .then((data: CheckoutResponse) => {
        route.push(`/report/${data.data.report_id}`);
      });
  };

  const deleteCartItemHandler = async (itemID: number) => {
    await fetch(`/api/carts/${itemID}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  return {
    states: {
      cart,
      isCheckoutModalShown,
      isBankNameDisabled,
      checkoutMetadata,
    },
    utils: {
      handleChange,
      setIsCheckoutModalShown,
      checkoutHandler,
      deleteCartItemHandler,
    },
  };
}

const CartPage: FC = () => {
  const { states, utils } = useLogic();

  return (
    <>
      {states.isCheckoutModalShown ? (
        <CheckoutModal
          bankName={states.checkoutMetadata.bank_name ?? ""}
          isBankNameDisabled={states.isBankNameDisabled}
          onChangeHandler={utils.handleChange}
          onCloseModalHandler={() => utils.setIsCheckoutModalShown(false)}
          onSubmitHandler={utils.checkoutHandler}
        />
      ) : null}

      <ProductDisplayLayout pageTitle="Keranjang Belanja">
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-2xl mb-10">Keranjang Belanja</h1>

          <DataCard>
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
                  <th scope="col" className="px-6 py-3">
                    Hapus
                  </th>
                </tr>
              </thead>

              <tbody className="border-b">
                {states.cart?.products && states.cart?.products.length ? (
                  states.cart?.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-center">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name} - {product.product_id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {product.quantity * product.price}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            utils.deleteCartItemHandler(product.id)
                          }
                          className="w-fit px-4 py-1 bg-red-500 text-white hover:bg-red-400 active:bg-red-600 transition-all duration-300 rounded-lg"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center" colSpan={5}>
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="my-10 ml-5 font-bold text-lg">
              Total Belanja: {states.cart?.total_price ?? 0}
            </div>

            <div className="w-full text-right flex justify-end">
              <RegularButton
                buttonType="primary"
                title="Checkout"
                action={() => utils.setIsCheckoutModalShown(true)}
              />
            </div>
          </DataCard>
        </div>
      </ProductDisplayLayout>
    </>
  );
};

export default CartPage;
