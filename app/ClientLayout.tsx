'use client'

import React, { ReactNode, useEffect } from 'react'
import { AppProvider } from './context/contextProvider'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/navbar/navbar'
import { usePathname } from 'next/navigation'

const ClientLayout = ({children}:{children:ReactNode}) => {
const pathname = usePathname();

useEffect(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}, []);
    return (
      <AppProvider>
    <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            className="min-h-svh"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1], // premium easing
            }}
          >
          
         
          <div className="sticky top-0 z-99">
            <Navbar />
          </div>
          <div className="">{children}</div>
         </motion.main>
        </AnimatePresence>
        </AppProvider>
  )
}

export default ClientLayout