import type { NextPage } from "next";
import ProductCard from "../components/cards/ProductCard";
import { useEffect, useState } from "react";
import ViewProductModal from "../components/modals/ViewProductModal";
import ProductDisplayLayout from "../components/layouts/ProductDisplayLayout";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { consumeApi } from "../utils/api-consume";
import Cookies from "js-cookie";
import Router from "next/router";

type ProductCategoryData = {
  id: number;
  name: string;
};

type AddCartRequest = {
  product_id: string;
};

type ProductData = {
  id: string;
  image: string | StaticImageData;
  name: string;
  price: number;
  category: string;
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

function useLogic() {
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [currentModalProductData, setCurrentModalProductData] =
    useState<ProductData>({
      id: "",
      image: "",
      name: "",
      price: 0,
      category: "",
    });
  const [products, setProducts] = useState<ProductData[]>([]);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryData[]
  >([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

  const viewButtonHandler = async (productID: string) => {
    const productData = (
      await consumeApi<ApiResponse<ProductData>>(`/api/products/${productID}`)
    ).data;

    setCurrentModalProductData({
      id: productData.id,
      image: productData.image,
      name: productData.name,
      price: productData.price,
      category: productData.category,
    });
    setIsModalShown(true);
  };

  useEffect(() => {
    const initDataFetch = async () => {
      const products = await consumeApi<ApiResponse<ProductData[]>>(
        "/api/products"
      );
      const productCategories = await consumeApi<
        ApiResponse<ProductCategoryData[]>
      >("/api/product-categories");

      setProducts(products.data);
      setProductCategories(productCategories.data);
    };

    initDataFetch();
  }, []);

  useEffect(() => {
    const loginExists = Cookies.get("loggedIn");
    setIsLoggedIn(loginExists === "true");
  }, []);

  const addToCartHandler = async (productID: string) => {
    if (!isLoggedIn) {
      Router.push("/login");
      return;
    }

    const req = await fetch("/api/carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productID }),
    });

    if (req.status === 201) {
      alert("Barang telah ditambahkan!");
    }
  };

  return {
    states: {
      isModalShown,
      currentModalProductData,
      products,
      productCategories,
    },
    utils: {
      viewButtonHandler,
      addToCartHandler,

      setIsModalShown,
    },
  };
}

const Home: NextPage = () => {
  const { states, utils } = useLogic();

  return (
    <ProductDisplayLayout pageTitle="Beranda">
      <>
        {/* modal product detail */}
        {states.isModalShown ? (
          <ViewProductModal
            productID={states.currentModalProductData.id}
            image={states.currentModalProductData.image}
            name={states.currentModalProductData.name}
            price={states.currentModalProductData.price}
            onCloseModalHandler={() => utils.setIsModalShown(false)}
            onBuyModalHandler={() =>
              utils.addToCartHandler(states.currentModalProductData.id)
            }
            category={states.currentModalProductData.category}
          />
        ) : null}

        <div className="flex flex-col w-full">
          <h1 className="mb-10 font-bold text-3xl">Katalog Produk</h1>

          <div className="flex w-full justify-between">
            {/* product */}
            <div className="flex flex-wrap">
              {states.products.map((value, index) => (
                <ProductCard
                  key={index}
                  viewProductClickHandler={() =>
                    utils.viewButtonHandler(value.id)
                  }
                  buyProductClickHandler={() =>
                    utils.addToCartHandler(value.id)
                  }
                  productName={value.name}
                  image={value.image}
                  category={value.category}
                />
              ))}
            </div>

            {/* product category */}
            <div className="w-2/4 h-fit shadow-lg bg-white rounded-lg p-8">
              <h3 className="font-bold text-xl mb-4">Kategori Produk</h3>
              <ul className="ml-4 mb-2">
                <li className="text-black font-bold">Semua Kategori</li>
              </ul>

              <ul className="ml-4">
                {states.productCategories.map((value, index) => (
                  <li
                    key={index}
                    className="text-blue-700 hover:text-blue-500 active:text-blue-800"
                  >
                    <Link href={`/category/${value.id}`}>{value.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    </ProductDisplayLayout>
  );
};

export default Home;
