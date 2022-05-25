import type { NextPage } from "next";
import ProductCard from "../../components/cards/ProductCard";
import { useEffect, useState } from "react";
import ViewProductModal from "../../components/modals/ViewProductModal";
import ProductDisplayLayout from "../../components/layouts/ProductDisplayLayout";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { consumeApi } from "../../utils/api-consume";
import { useRouter } from "next/router";

type ProductCategoryData = {
  id: number;
  name: string;
};

type ProductData = {
  id: string;
  image: string | StaticImageData;
  name: string;
  price: number;
  productCategory: ProductCategoryData;
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
      productCategory: {
        id: 0,
        name: "",
      },
    });
  const [products, setProducts] = useState<ProductData[]>([]);
  const [productCategories, setProductCategories] = useState<
    ProductCategoryData[]
  >([]);
  const [currentCategory, setCurrentCategory] = useState<ProductCategoryData>({
    id: 0,
    name: "",
  });

  const router = useRouter();
  const { categoryID } = router.query;

  const viewButtonHandler = async (productID: string) => {
    const productData = (
      await consumeApi<ApiResponse<ProductData>>(`/api/products/${productID}`)
    ).data;

    setCurrentModalProductData({
      id: productData?.id ?? "",
      image: productData?.image ?? "",
      name: productData?.name ?? "",
      price: productData?.price ?? 0,
      productCategory: {
        id: productData.productCategory?.id ?? 0,
        name: productData.productCategory?.name ?? "",
      },
    });
    setIsModalShown(true);
  };

  useEffect(() => {
    const initDataFetch = async () => {
      const products = await consumeApi<ApiResponse<ProductData[]>>(
        `/api/products/category/${categoryID}`
      );
      const productCategories = await consumeApi<
        ApiResponse<ProductCategoryData[]>
      >("/api/product-categories");
      const currentCategory = await consumeApi<
        ApiResponse<ProductCategoryData>
      >(`/api/product-categories/${categoryID}`);

      setCurrentCategory(currentCategory.data);
      setProducts(products.data);
      setProductCategories(productCategories.data);
    };

    categoryID && initDataFetch();
  }, [categoryID]);

  const addToCartHandler = (productID?: string) => {
    alert("ok");
  };

  return {
    states: {
      isModalShown,
      currentModalProductData,
      currentCategory,
      products,
      productCategories,
      categoryID,
    },
    utils: {
      viewButtonHandler,
      addToCartHandler,

      setIsModalShown,
    },
  };
}

const CategorizedProduct: NextPage = () => {
  const { states, utils } = useLogic();

  return (
    <ProductDisplayLayout
      pageTitle={`Kategori: ${states.currentCategory?.name ?? ""}`}
    >
      <>
        {/* modal product detail */}
        {states.isModalShown ? (
          <ViewProductModal
            productID={states.currentModalProductData?.id}
            image={states.currentModalProductData?.image}
            name={states.currentModalProductData?.name}
            price={states.currentModalProductData?.price}
            onCloseModalHandler={() => utils.setIsModalShown(false)}
            onBuyModalHandler={() =>
              utils.addToCartHandler(states.currentModalProductData?.id)
            }
            category={states.currentModalProductData?.productCategory.name}
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
                  category={value.productCategory?.name}
                />
              ))}
            </div>

            {/* product category */}
            <div className="w-72 h-fit shadow-lg bg-white rounded-lg p-8">
              <h3 className="font-bold text-xl mb-4">Kategori Produk</h3>
              <ul className="ml-4 mb-2">
                <li className="text-blue-700 hover:text-blue-500 active:text-blue-800">
                  <Link href={"/"}>Semua Kategori</Link>
                </li>
              </ul>

              <ul className="ml-4">
                {states.productCategories.map((value, index) => (
                  <li
                    key={index}
                    className={
                      states.categoryID !== String(value.id)
                        ? "text-blue-700 hover:text-blue-500 active:text-blue-800"
                        : "text-black font-bold"
                    }
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

export default CategorizedProduct;
