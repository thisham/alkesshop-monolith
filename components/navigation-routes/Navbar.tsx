import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { UserCircle } from "tabler-icons-react";

type ContainerProps = {
  children?: JSX.Element | string;
};

type ButtonProps = {
  buttonText?: string;
  action?: MouseEventHandler;
};

function useLogic() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const route = useRouter();
  const page = route.pathname;

  useEffect(() => {
    setIsLoggedIn(Boolean(Cookies.get("loggedIn")));
  }, [isLoggedIn]);

  const logoutHandler = () => {
    Cookies.remove("loggedIn");
    setIsLoggedIn(false);
    route.push("/");
  };

  return {
    states: {
      isLoggedIn,

      page,
      route,
    },
    utils: {
      logoutHandler,
    },
  };
}

const Navbar: FC = () => {
  const { states, utils } = useLogic();

  const Container: FC<ContainerProps> = (props) => (
    <div className="lg:w-4/5 w-5/6">{props.children}</div>
  );

  const RegularButton: FC<ButtonProps> = (props) => (
    <button
      className="py-1 px-3 hover:bg-slate-100 active:bg-slate-300 transition-all duration-300 rounded-lg"
      onClick={props.action}
    >
      {props.buttonText}
    </button>
  );

  return (
    <div className="h-16 z-50 shadow-lg bg-white flex items-center justify-center sticky top-0">
      <Container>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">
            <Link href={"/"}>ALKES.LSP</Link>
          </p>

          {/* Button Group */}
          <div className="flex flex-wrap space-x-4 w-fit">
            {states.isLoggedIn ? (
              <>
                {states.page === "/cart" ? (
                  <RegularButton
                    buttonText="Produk"
                    action={() => states.route.push("/")}
                  />
                ) : (
                  <RegularButton
                    buttonText="Keranjang"
                    action={() => states.route.push("/cart")}
                  />
                )}

                <RegularButton
                  buttonText="Logout"
                  action={utils.logoutHandler}
                />
              </>
            ) : states.page === "/login" ? (
              <RegularButton
                buttonText="Register"
                action={() => states.route.push("/register")}
              />
            ) : (
              <RegularButton
                buttonText="Login"
                action={() => states.route.push("/login")}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
