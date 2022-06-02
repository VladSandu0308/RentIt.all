import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  return (
    <div className='w-screen h-screen bg-login bg-cover flex relative'>
      <div className='absolute top-2 right-6'>
        <LanguageSelector />
      </div>
      <div className='m-auto bg-[#233C3B] bg-opacity-60 py-6 px-14 rounded-2xl flex flex-col'>
        <div className='mx-auto'>
          <img className='w-40 mx-8' src={logo} alt='logo'/>
        </div>
        <div className='mt-4 mx-auto flex'>
          <form className='flex flex-col'>
            <div className='mb-4 relative flex items-center'>
              <Icon icon="fluent:mail-24-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input placeholder='Email' className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>
            <div className='mb-4 relative flex items-center'>
              <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input placeholder={t("password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>

            <button onClick={() => navigate("/")} className='text-xs italic mx-auto mb-2 text-[#ead7ba] hover:text-[#ead7ba]/80'>{t("no-account")}</button>
            <button className='text-xs italic mx-auto mb-4 text-[#ead7ba] hover:text-[#ead7ba]/80'>{t("forgot-password")}</button>
            <button type="submit" className='bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 mx-auto mb-4 w-28 text-white py-2 px-4 rounded'>{t("login")}</button>
            
            <button type="button" class="text-white font-bold bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 focus:ring-4 focus:outline-none focus:ring-white/50 font-medium rounded-lg text-sm px-5 py-2.5 
                text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-auto mb-2 ">
                  <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                  {t("google-login")}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default Login