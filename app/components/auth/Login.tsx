import Image from 'next/image'
import React from 'react'

const Login = () => {
  return (
    <div className=' w-[65%] h-[70vh] flex'>
      <aside className='w-[35%] bg-[#960019] border-r-4 flex-col flex justify-between'>
        <header className='flex-col flex gap-5'>
          <div className='text-white pt-6 text-3xl flex justify-center hover:scale-115 hover:text-shadow-[0_0_10px] font-bold text-shadow-[0_0_20px] duration-500 transition-all'>Login</div>
          <div className='text-white p-2.5 text-lg font- flex justify-start'>It&apos;s look like you locked yourself out. <br /> Login to access all your belongings</div>
        </header>
        <div className='overflow-hidden self-end'>
          <Image src={"/Assets/Images/loginimgrs.png"} width={300} height={2} alt='' className='w-83 h-50'/>
        </div>
      </aside>
      <div className='w-[65%] bg-white'>Login right</div>
    </div>
  )
}

export default Login