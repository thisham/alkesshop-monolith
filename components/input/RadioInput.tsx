import { ChangeEventHandler, FC, MouseEventHandler } from "react";

type RadioItemProps = {
  title: string;
  value: string;

  // handlers
  onClick: MouseEventHandler<HTMLInputElement>;
};

type RadioInputProps = {
  masterLabel: string;
  groupName: string;
  radios: RadioItemProps[];
};

const RadioInput: FC<RadioInputProps> = (props) => (
  <>
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {props.masterLabel}
    </label>

    <div className="flex">
      {props.radios.map((item, index) => (
        <div key={index} className="flex flex-1">
          <div className="flex items-center mr-4">
            <input
              id={props.groupName + "_" + index}
              type="radio"
              value={item.value}
              name="gender"
              onClick={item.onClick}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="block text-gray-700 ml-2 text-base">
              {item.title}
            </label>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default RadioInput;
