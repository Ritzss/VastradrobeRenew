"use client";
import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const { loginForm, setLoginForm, handleLogin } = useAppContext();
  const [visible, setVisible] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(loginForm);
  };
  return (
    <div className="w-[65%] m-2 h-[70vh] flex">
      <aside className="w-[40%] bg-[#ffffff] text-[#ffffff] shadow-[inset_0_0_20px_#cd0000] border-r-4 flex-col flex justify-between">
        <header className="flex-col flex gap-5">
          <div className="font-sans text-[#cd0000] pt-6 text-4xl flex justify-center hover:scale-115 hover:text-shadow-[0_0_10px] font-bold text-shadow-[0_0_20px] duration-500 transition-all">
            Login
          </div>
          <div className="text-[#cd0000] p-2.5 text-xl font-great flex justify-start">
            It&apos;s look like you locked yourself out.
            <br />
            Login to access all your belongings.
          </div>
        </header>
        <div className="overflow-hidden self-end">
          <Image
            src={"/Assets/Images/authimg.png"}
            width={300}
            height={2}
            alt=""
            className="w-83 h-50"
          />
        </div>
      </aside>
      <aside className="w-[60%] font-sans bg-[#cd0000] text-white shadow-[inset_0_0_20px_#ffffff] flex flex-col justify-around items-center ">
        <header className="h-[50%] w-full p-4">
          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-between h-full p-4 "
          >
            <label className="flex justify-between" htmlFor="LoginID">
              <div className=" w-[40%] text-xl">EmailID:</div>
              <div className="border-b w-[65%]">
                <input
                  type="text"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  id="LoginID"
                  className="outline-0 flex items-center w-full"
                />
              </div>
            </label>
            <label className="flex justify-between" htmlFor="LoginPassword">
              <div className="w-[40%] text-xl">Password:</div>
              <div className="border-b flex w-[65%]">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  id="LoginPassword"
                  className="outline-0 flex items-center w-[90%]"
                />
                <div
                  className={`w-[10%] flex justify-center rounded-r `}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <EyeIcon className="w-[50%] " />
                  ) : (
                    <EyeClosedIcon className="w-[50%] " />
                  )}
                </div>
              </div>
            </label>
            <div className="flex justify-evenly">
              <button
                type="submit"
                className="text-2xl hover:-translate-y-1 hover:text-shadow-[0_16px_5px_rgba(0,0,0,0.34),0_0_7px_#FFFFFF] hover:scale-120 duration-500 transition-all"
              >
                Login
              </button>
              <button
                type="reset"
                className="text-2xl hover:-translate-y-1 hover:text-shadow-[0_16px_5px_rgba(0,0,0,0.34),0_0_7px_#FFFFFF] hover:scale-120 duration-500 transition-all"
              >
                Reset Password
              </button>
            </div>
          </form>
        </header>
        <footer className="">
          Here for the first time?{" "}
          <Link
            href={"register"}
            className="hover:underline hover:text-[#0092d6] duration-500 transition-all"
          >
            Register Here
          </Link>
        </footer>
      </aside>
    </div>
  );
};

export default Login;
