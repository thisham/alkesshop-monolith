import type { NextPage } from "next";
import Image from "next/image";
import AuthCard from "../components/cards/AuthCard";
import logo from "../public/logo.png";
import UnauthenticatedLayout from "../components/layouts/Unauthenticated";
import { FormEvent, useState } from "react";
import AuthButton from "../components/buttons/AuthButton";
import TextInput from "../components/input/TextInput";
import PasswordInput from "../components/input/PasswordInput";
import EmailInput from "../components/input/EmailInput";
import DateInput from "../components/input/DateInput";
import RadioInput from "../components/input/RadioInput";
import TextAreaInput from "../components/input/TextAreaInput";
import PhoneInput from "../components/input/PhoneInput";
import SelectInput from "../components/input/SelectInput";
import Link from "next/link";

enum GenderEnum {
  MALE = "Male",
  FEMALE = "Female",
}

type RegisterInput = {
  username?: string;
  password?: string;
  passwordConfirmation?: string;
  email?: string;
  birthDate?: Date;
  gender?: GenderEnum;
  address?: string;
  city?: string;
  phoneNumber?: string;
  paypalID?: string;
};

function useLogic() {
  const [registerInput, setRegisterInput] = useState<RegisterInput>();

  const handleChange = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegisterInput({
      ...registerInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const submitRegisterHandler = () => {
    alert(registerInput?.password);
  };

  return {
    states: {
      registerInput,
    },
    utils: {
      setRegisterInput,

      handleChange,
      submitRegisterHandler,
    },
  };
}

const Home: NextPage = () => {
  const { states, utils } = useLogic();

  return (
    <UnauthenticatedLayout pageTitle="Register">
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

          {/* password confirmation */}
          <PasswordInput
            inputName="passwordConfirmation"
            label="Konfirmasi Password"
            onChange={utils.handleChange}
            placeholder="yourstrongestpassword"
          />

          {/* email */}
          <EmailInput
            inputName="email"
            label="Email"
            onChange={utils.handleChange}
            placeholder="email@example.com"
          />

          {/* birthdate */}
          <DateInput
            inputName="birthDate"
            label="Tanggal Lahir"
            onChange={utils.handleChange}
          />

          {/* gender */}
          <RadioInput
            masterLabel="Gender"
            groupName="gender"
            radios={[
              { title: "Male", value: "Male", onClick: utils.handleChange },
              { title: "Female", value: "Female", onClick: utils.handleChange },
            ]}
          />

          {/* address */}
          <TextAreaInput
            inputName="address"
            label="Alamat"
            onChange={utils.handleChange}
          />

          {/* city */}
          <SelectInput
            masterLabel="Kota Domisili"
            defaultOptionTitle="Pilih Kota"
            options={[
              { value: "3515", title: "Sidoarjo" },
              { value: "3578", title: "Surabaya" },
              { value: "3525", title: "Gresik" },
            ]}
            onChange={utils.handleChange}
          />

          {/* phone */}
          <PhoneInput
            inputName="phone"
            label="Nomor HP"
            onChange={utils.handleChange}
            placeholder="081234567890"
          />

          {/* paypal id */}
          <TextInput
            inputName="paypalID"
            label="Paypal ID"
            onChange={utils.handleChange}
            placeholder="901373874892"
          />

          {/* submit */}
          <div className="pt-5 text-center">
            <AuthButton action={utils.submitRegisterHandler} title="Register" />
          </div>

          <Link href="/login">
            <div className="text-center mt-6 text-blue-400 cursor-pointer">
              Sudah punya akun? Login di sini!
            </div>
          </Link>
        </div>
      </AuthCard>
    </UnauthenticatedLayout>
  );
};

export default Home;
