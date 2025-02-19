import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';

const AddPrice = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState(50);
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    if (state.id && input) {
      try {
        setError('');
        await server.put(`/location/${state.id}`, {price: input});
        navigate("/host", {state: {user: state.user}});
      } catch (e) {
        setError(e.message);
      }
    } else {
      if (!input) {
        setError("Please insert title")
      } else {
        state.body = {...state.body,  price: input};

        navigate("/host/add/cerere", {state});
      }
     
    }
  }
  return (
    <div className='min-w-screen min-h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='my-auto mx-8 text-5xl font-serif font-bold text-textMain select-none'>
        {t("set-price")}
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col relative'>
        <div className='relative top-4 right-8 flex items-center gap-3'>
          <button class="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-24 top-0" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
          
          <button class="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-0 top-0" onClick={() => navigate("/host", {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("exit")}</span>
          </button>
          { error && 
              
              <div class="mx-auto mt-14 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20 absolute inset-x-56 top-0" role="alert">
                <p class="font-bold">{t("error")}</p>
                <p class="text-sm">{error}</p>
              </div>
          }
        </div>
        <div className='mx-auto my-auto relative flex items-center gap-20'>
          <button onClick={() => setInput(Math.max(50,(input - 5)))} class="text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-20 h-20 py-2 px-3 rounded-full z-50">
            <Icon icon="bx:minus" color="#233c3b" height="54" className=''/>
          </button>

          <Icon icon="healthicons:money-bag" color="#233c3b" height="36" className='absolute ml-44 mb-1 select-none'/>
          <input type="number" step="5" min="50" placeholder={t("price")} className='price-text pr-2' onChange={e => setInput(e.target.value)} value={input}/>

          <button onClick={() => setInput(Number(input) + 5)} class=" text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-20 h-20 py-2 px-3 rounded-full z-50">
            <Icon icon="bx:plus" color="#233c3b" height="54" className=''/>
          </button>
        </div>

        <div class="bg-gray-200 h-2 relative inset-x-0 bottom-20">
          <div class="bg-primary h-2" style={{width: "90%"}}></div>
        </div>
        <button type="submit" onClick={onSubmit} className='absolute bottom-6 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>

      </div>
    </div>
  )
}

export default AddPrice