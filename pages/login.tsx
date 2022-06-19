import type { NextPage } from "next";
import Image from "next/image";
import AuthCard from "../components/cards/AuthCard";
import logo from "../public/logo.png";
import UnauthenticatedLayout from "../components/layouts/Unauthenticated";
import { FormEvent, useState } from "react";
import AuthButton from "../components/buttons/AuthButton";
import TextInput from "../components/input/TextInput";
import PasswordInput from "../components/input/PasswordInput";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

type LoginInput = {
  username?: string;
  password?: string;
};

function useLogic() {
  const [loginInput, setLoginInput] = useState<LoginInput>();
  const router = useRouter();

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const submitLoginHandler = async () => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInput),
    }).then((res) => {
      if (res.status !== 201) {
        router.push("/register");
        return;
      }

      Cookies.set("loggedIn", "true");
      router.push("/");
    });
  };

  return {
    states: {
      loginInput,
    },
    utils: {
      setLoginInput,

      handleChange,
      submitLoginHandler,
    },
  };
}

const Home: NextPage = () => {
  const { states, utils } = useLogic();

  return (
    <UnauthenticatedLayout pageTitle="Login">
      <AuthCard>
        {/* card headers */}
        <div className="flex flex-row space-x-4 items-end">
          {/* image */}
          <div className="relative w-24 h-24">
            <Image src={logo} alt="Logo toko alkes." layout="fill" />
          </div>

          {/* title */}
          <div>
            <h3 className="text-lg">Selamat Datang di</h3>
            <h1 className="text-3xl font-bold">Toko Alat Kesehatan</h1>
          </div>
        </div>

        {/* card form */}
        <div className="mt-8 space-y-2">
          {/* username */}
          <TextInput
            inputName="username"
            label="Username"
            onChange={utils.handleChange}
            placeholder="your.username_"
          />

          {/* password */}
          <PasswordInput
            inputName="password"
            label="Password"
            onChange={utils.handleChange}
            placeholder="yourstrongestpassword"
          />

          {/* submit */}
          <div className="pt-5 text-center">
            <AuthButton action={utils.submitLoginHandler} title="Login" />
          </div>
        </div>

        <Link href="/register">
          <div className="text-center mt-6 text-blue-400 cursor-pointer">
            Belum punya akun? Daftar di sini!
          </div>
        </Link>
      </AuthCard>
    </UnauthenticatedLayout>
  );
};

export default Home;
