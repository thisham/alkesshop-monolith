import Image, { StaticImageData } from "next/image";
import { ChangeEventHandler, FC, MouseEvent, MouseEventHandler } from "react";
import ProductItemCardButton from "../buttons/ProductItemCardButton";
import SelectInput from "../input/SelectInput";
import TextInput from "../input/TextInput";

type CheckoutModalProps = {
  isBankNameDisabled: boolean;
  bankName: string;
  // handlers
  onChangeHandler?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onCloseModalHandler: MouseEventHandler;
  onSubmitHandler: MouseEventHandler;
};

const CheckoutModal: FC<CheckoutModalProps> = (props) => (
  // background
  <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    {/* card */}
    <div className="w-1/2 h-2/5 flex flex-col relative bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-10">
        <SelectInput
          inputName="payment_type"
          masterLabel="Metode Pembayaran"
          defaultOptionTitle="Pilih Metode"
          onChange={props.onChangeHandler}
          options={[
            { value: "POSTPAID", title: "POSTPAID", isSelected: false },
            { value: "PREPAID", title: "PREPAID", isSelected: false },
          ]}
        />
        <div className="my-5"></div>
        <TextInput
          inputName="bank_name"
          label="Nama Bank"
          isDisabled={props.isBankNameDisabled}
          value={props.bankName}
          onChange={props.onChangeHandler}
        />
      </div>
      {/* buttons */}
      <div className="bottom-0 w-full z-0 absolute">
        <ProductItemCardButton
          title="Checkout"
          buttonType="primary"
          action={props.onSubmitHandler}
        />
        <ProductItemCardButton
          title="Tutup"
          buttonType="alternative"
          action={props.onCloseModalHandler}
        />
      </div>
    </div>
  </div>
);

export default CheckoutModal;
