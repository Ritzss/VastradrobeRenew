import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import { notFound } from 'next/navigation';
import React from 'react'

type PageProps = {
  params: {
    auth: string;
  }
};

const page = async ({params}:PageProps) => {
    const {auth} = await params
    const allowed = [
    "login",
    "register",
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
}

export default page