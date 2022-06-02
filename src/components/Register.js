import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useAuth } from '../context/UserAuthContext';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { signup, google, login } = useAuth();

  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    console.log(data);

    if(data.password != data.password2) {
      setError(t("password-match"));
      console.log("Error: " + error);
      return;
    }

    try {
      setError('');
      await signup(data.email, data.password, data.name);
      await login(data.email, data.password);
      navigate("/updateProfile");
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
        <div className='mt-4 mx-auto flex'>
          <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="bi:person-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("first_name")} placeholder={t("first-name")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="bi:person-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("last_name")} placeholder={t("last-name")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>
            </div>

            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="fluent:mail-24-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("email")} placeholder='Email' className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="carbon:phone-filled" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("phone")} placeholder={t("phone")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>
            </div>

            <div className='mb-4 relative flex flex-row gap-6'>
              <div>
                <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("password")} type="password" placeholder={t("password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
                </input>
              </div>

              <div>
                <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("password2")} type="password" placeholder={t("confirm-password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 text-white border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
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