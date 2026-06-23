import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import ResetPasswordPage from '@/components/auth/resetPassword';
import { notFound } from 'next/navigation';
import { Metadata }  from "next";

type PageProps = {
  params: {
    auth: string;
  }
};


export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

const page = async ({params}:PageProps) => {
    const {auth} = await params
    const allowed = [
    "login",
    "register",
    "reset_password"
  ];
  if (!allowed.includes(auth)) {
      notFound();
    }
  if(auth==="login"){
    return(
      <Login />
    )
  }
  else if (auth==="register"){
   return (
     <Register />
   )
  }
  else if (auth==="reset_password"){
   return (
     <ResetPasswordPage />
   )
  }
}

export default page