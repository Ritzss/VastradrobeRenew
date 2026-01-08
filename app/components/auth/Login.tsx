"use client";
import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const { loginForm, setLoginForm } = useAppContext();
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
      <aside className="w-[35%] bg-[#960019] border-r-4 flex-col flex justify-between">
        <header className="flex-col flex gap-5">
          <div className="font-mono text-white pt-6 text-3xl flex justify-center hover:scale-115 hover:text-shadow-[0_0_10px] font-bold text-shadow-[0_0_20px] duration-500 transition-all">
            Login
          </div>
          <div className="text-white p-2.5 text-2xl font-great flex justify-start">
            It&apos;s look like you locked yourself out.
            <br />
            Login to access all your belongings.
          </div>
        </header>
        <div className="overflow-hidden self-end">
          <Image
            src={"/Assets/Images/loginimgrs.png"}
            width={300}
            height={2}
            alt=""
            className="w-83 h-50"
          />
        </div>
      </aside>
      <aside className="w-[65%] font-mono bg-white flex flex-col justify-around items-center ">
        <header className="h-[50%] w-full p-4">
          <form
            method="POST"
            className="flex flex-col justify-between h-full p-4 "
          >
            <label className="flex justify-between" htmlFor="LoginID">
              <div className=" w-[35%] text-xl">
                UserName/EmailID:
              </div>
              <div className="border-b w-[65%]">
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleInputChange}
                  placeholder="UserName/Email"
                  id="LoginID"
                  className="outline-0 flex items-center w-full"
                />
              </div>
            </label>
            <label className="flex justify-between"
              htmlFor="LoginPassword"
            >
              <div className="w-[35%] text-xl">
                Password:
              </div>
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
              <button className="text-2xl hover:-translate-y-1 hover:text-[#960019] duration-500 transition-all hover:text-shadow-[0px_16px_5px_rgba(0,0,0,0.34)]">Login</button>
              <button className="text-2xl hover:-translate-y-1 hover:text-[#960019] duration-500 transition-all hover:text-shadow-[0px_16px_5px_rgba(0,0,0,0.34)]">Reset Password</button>
            </div>
          </form>
        </header>
        <footer className="">Here for the first time? <Link href={"register"} className="hover:underline hover:text-[#0092d6] duration-500 transition-all">Register Here</Link></footer>
      </aside>
    </div>
  );
};

export default Login;
