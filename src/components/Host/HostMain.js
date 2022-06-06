import React from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Footer from '../Footer'
import Navbar from '../Navbar'

const HostMain = () => {
  const {state} = useLocation();
  const {t} = useTranslation();

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary'>

      </div>
        
      <div className='bottom-0'>
      <Footer />   
      </div>
       
    </div>
  )
}

export default HostMain