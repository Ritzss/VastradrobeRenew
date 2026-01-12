"use client";
import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const { registerForm, setRegisterForm, handleRegister} = useAppContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRegisterForm((prev: any) => ({ ...prev, [name]: value }));
  };

 
  return (
    <section className=" w-[65%] m-2 h-[70vh] flex">
      <aside className="w-[40%] bg-[#ffffff] text-[#ffffff] shadow-[inset_0_0_20px_#cd0000] border-r-4 h-full flex-col flex justify-between">
        <header className="flex-col flex gap-5">
          <div className="font-sans text-[#cd0000] pt-6 text-4xl flex justify-center hover:scale-115 hover:text-shadow-[0_0_10px] font-bold text-shadow-[0_0_20px] duration-500 transition-all">
            Register
          </div>
        <div className="text-[#cd0000] p-2.5 text-xl font-great flex justify-start">
            It&apos;s look like you found yourself to a brand new Fashion hub.
            <br />
            <br />
            Register to begin you new Journey with Us.
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
      <aside className="w-[60%] font-sans bg-[#cd0000] text-white shadow-[inset_0_0_20px_#ffffff] flex flex-col justify-center items-center ">
        <form
          method="POST"
          className="flex flex-col justify-evenly w-full h-full p-4 "
        >
          <label className="flex justify-between" htmlFor="LoginID">
            <div className=" w-[40%] text-xl">UserName:</div>
            <div className="border-b w-[65%]">
              <input
                type="text"
                name="username"
                value={registerForm.username}
                onChange={handleInputChange}
                placeholder="UserName"
                id="LoginID"
                className="outline-0 flex items-center w-full"
              />
            </div>
          </label>
          <label className="flex justify-between" htmlFor="LoginID">
            <div className=" w-[40%] text-xl">Email:</div>
            <div className="border-b w-[65%]">
              <input
                type="text"
                name="email"
                value={registerForm.email}
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
                value={registerForm.password}
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
            <button onClick={handleRegister} className="text-2xl hover:scale-110 hover:-translate-y-1 hover:text-[#960019] duration-500 transition-all hover:text-shadow-[0px_16px_5px_rgba(0,0,0,0.34)]">
              Register
            </button>
          </div>
        </form>
        <footer className="h-[40%] flex justify-between w-full p-1 gap-1">
          <div>Havn&apos;t we met before? <Link href={"login"} className="hover:underline hover:text-[#0092d6] duration-500 transition-all">Login</Link></div>
          <div className=""><Link href={"reset_password"} className="hover:underline hover:text-[#0092d6] duration-500 transition-all">Forgot Password</Link>?Don&apos;t restart</div>
        </footer>
      </aside>
    </section>
  );
};

export default Register;
