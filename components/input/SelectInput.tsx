import { ChangeEventHandler, FC, MouseEventHandler } from "react";

type SelectItemProps = {
  title: string;
  value: string;
  isSelected?: boolean;
};

type SelectInputProps = {
  masterLabel: string;
  defaultOptionTitle: string;
  options: SelectItemProps[];

  // handlers
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const SelectInput: FC<SelectInputProps> = (props) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {props.masterLabel}
    </label>

    <select
      id="countries"
      defaultValue=""
      className="border shadow-sm border-slate-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <option value="" disabled>
        {props.defaultOptionTitle}
      </option>

      {props.options.map((item, index) => (
        <option key={index} value={item.value}>
          {item.title}
        </option>
      ))}
    </select>
  </>
);

export default SelectInput;
