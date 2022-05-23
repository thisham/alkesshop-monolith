import type { NextPage } from "next";
import ProductCard from "../components/cards/ProductCard";
import { useState } from "react";
import ViewProductModal from "../components/modals/ViewProductModal";
import ProductDisplayLayout from "../components/layouts/ProductDisplayLayout";
import { StaticImageData } from "next/image";
import Link from "next/link";

type ProductData = {
  productID: string;
  image: string | StaticImageData;
  name: string;
  price: number;
  category: string;
};

const data: ProductData[] = [
  {
    productID: "001",
    image:
      "https://res.cloudinary.com/ddkw0ja00/image/upload/v1653236595/lsp-tokoalkes/3971203_fq9b5c.jpg",
    name: "Tensimeter Digital",
    price: 120000,
    category: "Tensimeter",
  },
  {
    productID: "002",
    image:
      "https://res.cloudinary.com/ddkw0ja00/image/upload/v1653236595/lsp-tokoalkes/3971203_fq9b5c.jpg",
    name: "Tensimeter Analog",
    price: 120000,
    category: "Tensimeter",
  },
  {
    productID: "003",
    image:
      "https://res.cloudinary.com/ddkw0ja00/image/upload/v1653236595/lsp-tokoalkes/3971203_fq9b5c.jpg",
    name: "Kasa Steril",
    price: 120000,
    category: "Verband",
  },
  {
    productID: "004",
    image:
      "https://res.cloudinary.com/ddkw0ja00/image/upload/v1653236595/lsp-tokoalkes/3971203_fq9b5c.jpg",
    name: "Verband",
    price: 120000,
    category: "Verband",
  },
  {
    productID: "005",
    image:
      "https://res.cloudinary.com/ddkw0ja00/image/upload/v1653236595/lsp-tokoalkes/3971203_fq9b5c.jpg",
    name: "Pisau Bedah",
    price: 120000,
    category: "Alat Besi",
  },
];

const categories = ["Verband", "Tensimeter", "Alat Besi"];

function useLogic() {
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [currentModalProductData, setCurrentModalProductData] =
    useState<ProductData>({
      productID: "",
      image: "",
      name: "",
      price: 0,
      category: "",
    });

  const viewButtonHandler = (productID: string) => {
    const productData = data.find((product) => product.productID === productID);

    setCurrentModalProductData({
      productID: productData?.productID ?? "",
      image: productData?.image ?? "",
      name: productData?.name ?? "",
      price: productData?.price ?? 0,
      category: productData?.category ?? "",
    });
    setIsModalShown(true);
  };

  const addToCartHandler = (productID?: string) => {
    alert("ok");
  };

  return {
    states: {
      isModalShown,
      currentModalProductData,
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
    <ProductDisplayLayout pageTitle="Toko Alat Kesehatan">
      <>
        {/* modal product detail */}
        {states.isModalShown ? (
          <ViewProductModal
            productID={states.currentModalProductData.productID}
            image={states.currentModalProductData.image}
            name={states.currentModalProductData.name}
            price={states.currentModalProductData.price}
            onCloseModalHandler={() => utils.setIsModalShown(false)}
            onBuyModalHandler={() =>
              utils.addToCartHandler(states.currentModalProductData.productID)
            }
            category={states.currentModalProductData.category}
          />
        ) : null}

        <div className="flex flex-col w-full">
          <h1 className="mb-10 font-bold text-3xl">Katalog Produk</h1>

          <div className="flex w-full justify-between">
            {/* product */}
            <div className="flex flex-wrap">
              {data.map((value, index) => (
                <ProductCard
                  key={index}
                  viewProductClickHandler={() =>
                    utils.viewButtonHandler(value.productID)
                  }
                  buyProductClickHandler={() =>
                    utils.addToCartHandler(value.productID)
                  }
                  productName={value.name}
                  image={value.image}
                  category={value.category}
                />
              ))}
            </div>

            {/* product category */}
            <div className="right-0 w-96 h-fit shadow-lg bg-white rounded-lg p-8">
              <h3 className="font-bold text-xl mb-4">Kategori Produk</h3>

              <ul className="ml-4">
                {categories.map((value, index) => (
                  <li
                    key={index}
                    className="text-blue-700 hover:text-blue-500 active:text-blue-800"
                  >
                    <Link href={""}>{value}</Link>
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
