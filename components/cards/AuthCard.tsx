import { FC } from "react";

type AuthCardProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const AuthCard: FC<AuthCardProps> = (props) => {
  return (
    <div className="block bg-white shadow-lg lg:w-2/5 w-full p-10">
      {props.children}
    </div>
  );
};

export default AuthCard;
