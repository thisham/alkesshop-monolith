import { FC, MouseEventHandler } from "react";

type AuthButtonProps = {
  title: string;
  action: MouseEventHandler;
};

const AuthButton: FC<AuthButtonProps> = (props) => {
  return (
    <button
      onClick={props.action}
      className="bg-blue-500 px-9 py-3 text-white rounded-sm"
    >
      {props.title}
    </button>
  );
};

export default AuthButton;
