import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const Register = () => {
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
            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="bi:person-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder={t("first-name")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="bi:person-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder={t("last-name")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>
            </div>

            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="fluent:mail-24-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder='Email' className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="carbon:phone-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder={t("phone")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>
            </div>

            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder={t("password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input placeholder={t("confirm-password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>
            </div>

            <button onClick={() => navigate("/login")} className='text-xs italic mx-auto mb-5 text-[#ead7ba] hover:text-[#ead7ba]/80'>{t("already-account")}</button>
            <button type="submit" className='bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 mx-auto mb-4 w-30 text-white py-2 px-4 rounded'>{t("signup")}</button>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default Register