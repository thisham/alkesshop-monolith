import { FC } from "react";

type DataCardProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const DataCard: FC<DataCardProps> = (props) => {
  return (
    <div className="block bg-white shadow-lg w-full h-fit p-10">
      {props.children}
    </div>
  );
};

export default DataCard;
