import Footer from '@/components/Global/Footer'
import CategoryBar from '@/components/navbar/Categorybar'
import ParentSubCategoryBar from '@/components/navbar/ParentSubCategoryBar'
import { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <section className=''>
      <CategoryBar className={"bg-[#ffffff] text-[#cd0000] rounded-b-xl"} drop={false} Img={false} />
      <ParentSubCategoryBar />
        <div className='w-full full'>{children}</div>
     
    </section>
  )
}

export default layout