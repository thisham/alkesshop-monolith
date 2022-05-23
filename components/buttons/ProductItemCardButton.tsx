import { FC, MouseEventHandler } from "react";

type ProductItemCardButtonProps = {
  title: string;
  buttonType: "primary" | "alternative";
  action: MouseEventHandler;
};

const ProductItemCardButton: FC<ProductItemCardButtonProps> = (props) => {
  const itemClassName: string =
    props.buttonType === "primary"
      ? "w-1/2 py-3 bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 transition-all duration-300"
      : "w-1/2 py-3 bg-white text-blue-500 hover:bg-slate-100 active:bg-slate-300 transition-all duration-300";

  return (
    <button onClick={props.action} className={itemClassName}>
      {props.title}
    </button>
  );
};

export default ProductItemCardButton;
