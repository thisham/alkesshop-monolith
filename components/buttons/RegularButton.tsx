import { FC, MouseEventHandler } from "react";

type RegularButton = {
  title: string;
  buttonType: "primary" | "alternative";
  action: MouseEventHandler;
};

const RegularButton: FC<RegularButton> = (props) => {
  const itemClassName: string =
    props.buttonType === "primary"
      ? "w-fit px-6 py-3 bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 transition-all duration-300 rounded-lg"
      : "w-fit px-6 py-3 bg-white text-blue-500 hover:bg-slate-100 active:bg-slate-300 transition-all duration-300";

  return (
    <button onClick={props.action} className={itemClassName}>
      {props.title}
    </button>
  );
};

export default RegularButton;
