import { ChangeEventHandler, FC } from "react";

type TextInputProps = {
  inputName: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;

  // handlers
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

const TextAreaInput: FC<TextInputProps> = (props) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {props.label}
    </label>
    <textarea
      name={props.inputName}
      id={props.inputName}
      placeholder={props.placeholder}
      onChange={props.onChange}
      required={props.isRequired}
      className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
    ></textarea>
  </>
);

export default TextAreaInput;
