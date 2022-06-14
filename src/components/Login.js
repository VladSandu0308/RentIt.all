import React from 'react'
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/UserAuthContext';
import { server } from '../services/axios';
import useUser from '../hooks/useUser';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { signup, google, login, currentUser } = useAuth();

  const { setUser } = useUser();

  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setError('');
      await login(data.email, data.password);
      server.post("login", {email: data.email}).then(ret => {
        setUser(ret.data.user[0])
        navigate("/search", {state: {user: ret.data.user[0]}});
      })
      
    } catch (e) {
      setError(e.message);
      console.log("Error: " + e);
    }
  }

  const handleGoogle = async (data) => {
    google().then(async e => {
      server.post("/login", {email: e.user.email}).then(ret => {
        setUser(ret.data.user[0])
        if (ret.data.path != "/setPhone") {
          navigate(ret.data.path, {state: {user: ret.data.user[0]}})
        } else {
          navigate(ret.data.path, {state: {email: ret.data.email}})
        }  
      })
    });
  }


  return (
    <div className='w-screen h-screen bg-login bg-cover flex relative'>
      <div className='absolute top-2 right-6'>
        <LanguageSelector />
      </div>
      <div className='m-auto bg-[#233C3B] bg-opacity-60 py-6 px-14 rounded-2xl flex flex-col'>
        <div className='mx-auto'>
          <img className='w-36 mx-8' src={logo} alt='logo'/>
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
            <div className='mb-4 relative flex items-center'>
              <Icon icon="ri:lock-password-fill" color="#ead7ba" height="24" className='absolute ml-2 pb-0.5'/>
              <input {...register("password")} type="password" placeholder={t("password")} className='placeholder-[#ead7ba] hover:placeholder-[#ead7ba]/80 transition-colors duration-300 text-[#ead7ba] border-0 border-b-2 border-[#ead7ba] bg-inherit focus:outline-none pl-10 pb-0.5'>
              </input>
            </div>

            <button onClick={() => navigate("/")} className='text-xs italic mx-auto mb-2 text-[#ead7ba] hover:text-[#ead7ba]/80 transition-colors duration-300'>{t("no-account")}</button>
            <button onClick={() => navigate("/reset")} className='text-xs italic mx-auto mb-4 text-[#ead7ba] hover:text-[#ead7ba]/80 transition-colors duration-300'>{t("forgot-password")}</button>
            <button type="submit" className='bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 mx-auto mb-4 w-28 text-white py-2 px-4 rounded'>{t("login")}</button>
            
            
          </form>

          <button type="button" onClick={handleGoogle} class="text-white font-bold bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-white/50 font-medium rounded-lg text-sm px-5 py-2.5 
                text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-auto mb-2 ">
                  <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                  {t("google-login")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login