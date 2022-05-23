import Image, { StaticImageData } from "next/image";
import { FC, MouseEventHandler } from "react";
import ProductItemCardButton from "../buttons/ProductItemCardButton";

type ProductCardProps = {
  image: string | StaticImageData;
  imageAlt?: string;
  productName: string;
  category: string;

  // handler
  buyProductClickHandler: MouseEventHandler;
  viewProductClickHandler: MouseEventHandler;
};

const ProductCard: FC<ProductCardProps> = (props) => {
  return (
    <div className="block bg-white shadow-lg w-80 h-fit rounded-lg m-5 overflow-hidden">
      <div className="w-80 h-80 relative">
        <Image
          src={props.image}
          alt={props.imageAlt}
          layout="fill"
          className="object-cover"
        />
      </div>
      <div className="px-5 py-2">{props.productName}</div>
      <div className="px-5 pb-4 text-xs text-gray-400">{props.category}</div>
      <div className="pt-2">
        <ProductItemCardButton
          title="Lihat"
          buttonType="alternative"
          action={props.viewProductClickHandler}
        />
        <ProductItemCardButton
          title="Beli"
          buttonType="primary"
          action={props.buyProductClickHandler}
        />
      </div>
    </div>
  );
};

export default ProductCard;
