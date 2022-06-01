import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className='w-screen h-screen bg-login bg-cover flex relative'>
      <div className='absolute top-2 right-6'>
        <LanguageSelector />
      </div>
      <div className='m-auto bg-[#233C3B] bg-opacity-60 p-4 rounded-2xl flex flex-col'>
        <div className='mx-auto'>
          <img className='w-40 mx-8' src={logo} alt='logo'/>
        </div>
        <div className='mt-4 mx-auto flex'>
          <form >
            <div className='mb-4 relative flex items-center'>
              <Icon icon="fluent:mail-24-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input placeholder='Email' className='placeholder-[#ead7ba] text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>
            <div className='mb-4 relative flex items-center'>
              <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input placeholder={t("password")} className='placeholder-[#ead7ba] text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>

            <a href='#' className='text-xs italic mx-3 text-[#ead7ba]'>{t("signup")}</a>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login