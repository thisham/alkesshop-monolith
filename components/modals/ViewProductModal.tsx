import Image, { StaticImageData } from "next/image";
import { FC, MouseEvent, MouseEventHandler } from "react";
import ProductItemCardButton from "../buttons/ProductItemCardButton";

type ViewProductModalProps = {
  productID: string;
  image: string | StaticImageData;
  name: string;
  price: number;
  category: string;

  // handlers
  onCloseModalHandler: MouseEventHandler;
  onBuyModalHandler: MouseEventHandler;
};

const ViewProductModal: FC<ViewProductModalProps> = (props) => (
  <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    <div className="w-1/2 h-3/4 bg-white shadow-lg rounded-lg flex overflow-hidden">
      <div className="h-full w-1/2 relative">
        <Image
          src={props.image}
          alt={props.name}
          className="object-cover"
          layout="fill"
        />
      </div>

      <div className="w-1/2 h-full flex flex-col justify-between">
        {/* detail */}
        <div className="px-4 pt-4 space-y-2">
          <div className="font-bold text-2xl">{props.name}</div>
          <div className="text-lg">Rp. {props.price},-</div>
          <div className="text-base">Kategori: {props.category}</div>
        </div>

        {/* buttons */}
        <div className="bottom-0 z-0">
          <ProductItemCardButton
            title="Beli"
            buttonType="primary"
            action={props.onBuyModalHandler}
          />
          <ProductItemCardButton
            title="Tutup"
            buttonType="alternative"
            action={props.onCloseModalHandler}
          />
        </div>
      </div>
    </div>
  </div>
);

export default ViewProductModal;
