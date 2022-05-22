import { FC } from "react";

type ProductCardProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const ProductCard: FC<ProductCardProps> = (props) => {
  return (
    <div className="block bg-white shadow-lg lg:w-2/5 w-32 p-10">
      {props.children}
    </div>
  );
};

export default ProductCard;
