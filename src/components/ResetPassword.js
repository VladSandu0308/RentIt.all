import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/UserAuthContext';
import { server } from '../services/axios';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { resetPassword } = useAuth();

  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setError('');
      await resetPassword(data.email,);
      navigate("/login");
    } catch (e) {
      setError(e.message);
      console.log("Error: " + e);
    }
  }



  return (
    <div className='w-screen h-screen bg-login bg-cover flex relative'>
      <div className='absolute top-2 right-6'>
        <LanguageSelector />
      </div>
      <div className='m-auto bg-[#233C3B] bg-opacity-60 py-6 px-14 rounded-2xl flex flex-col'>
        <div className='mx-auto'>
          <img className='w-40 mx-8' src={logo} alt='logo'/>
        </div>
        { error && 
            
            <div class="mx-auto mt-2 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md" role="alert">
              <p class="font-bold">{t("error")}</p>
              <p class="text-sm">{error}</p>
            </div>
        }
        <div className='mt-4 mx-auto flex flex-col'>
          <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4 relative flex items-center'>
              <Icon icon="fluent:mail-24-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input {...register("email")} placeholder='Email' className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 transition-colors duration-300 text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-transparent focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>

            <button onClick={() => navigate("/login")} className='text-xs italic mx-auto mb-5 text-[#ead7ba] hover:text-[#ead7ba]/80'>{t("already-account")}</button>

            <button type="submit" className='bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 mx-auto mb-4 w-28 text-white py-2 px-4 rounded'>{t("submit")}</button>
            
            
          </form>

        </div>
      </div>
    </div>
  )
}

export default ResetPassword