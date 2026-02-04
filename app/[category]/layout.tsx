import CategoryBar from '@/components/navbar/Categorybar'
import ParentSubCategoryBar from '@/components/navbar/ParentSubCategoryBar'
import { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <section className=''>
      <article className='group'>
        <CategoryBar className={" text-[#cd0000]"} drop={false} Img={false} />
      <ParentSubCategoryBar className='-translate-y-30 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0'/>
      </article>
        <div className='w-full full'>{children}</div>
     
    </section>
  )
}

export default layout