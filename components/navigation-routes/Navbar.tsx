import { FC, MouseEventHandler } from "react";
import { UserCircle } from "tabler-icons-react";

type NavbarProps = {
  test: string;
};

type ContainerProps = {
  children?: JSX.Element | string;
};

type UserButtonProps = {
  buttonText?: string;
  action?: MouseEventHandler;
};

const Navbar: FC<NavbarProps> = (props) => {
  const Container: FC<ContainerProps> = (props) => (
    <div className="lg:w-4/5 w-5/6">{props.children}</div>
  );

  const UserButton: FC<UserButtonProps> = (props) => (
    <button
      onClick={props.action}
      className="rounded-full flex items-center bg-slate-200 hover:bg-slate-300 transition-all duration-300"
    >
      <p className="pl-4 pr-1">{props.buttonText ?? "Welkomm!"}</p>
      <UserCircle size={36} color="#2c3e50" />
    </button>
  );

  return (
    <div className="h-16 z-50 shadow-lg bg-white flex items-center justify-center sticky top-0">
      <Container>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">ALKES.LSP</p>

          {/* Button Group */}
          <div className="flex flex-wrap space-x-4 w-fit">
            <UserButton />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
