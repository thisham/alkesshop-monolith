import { ChangeEventHandler, FC } from "react";

type TextInputProps = {
  inputName: string;
  label: string;
  value?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;

  // handlers
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const TextInput: FC<TextInputProps> = (props) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {props.label}
    </label>
    <input
      type="text"
      name={props.inputName}
      id={props.inputName}
      disabled={props.isDisabled}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      required={props.isRequired}
      className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
    />
  </>
);

export default TextInput;
