import Footer from '@/components/Global/Footer'
import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <section className=''>
        <div className='w-full full'>{children}</div>
        <Footer />
    </section>
  )
}

export default layout