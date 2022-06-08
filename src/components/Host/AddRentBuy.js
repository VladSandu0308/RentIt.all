import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddRentBuy = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState();

  const onSubmit = e => {
    e.preventDefault();

    state.body = {mode: input}

    navigate("/host/add/title", {state});


  }

  return (
    <div className='min-w-screen min-h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='my-auto mx-8 text-5xl font-serif font-bold text-textMain'>
          Set your announce type
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col relative'>
        <div className='absolute top-4 right-8 flex items-center gap-3'>
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
          
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate("/host", {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>Exit</span>
          </button>
        </div>
        <div className='my-auto relative flex flex-col gap-10'>
          <button className='button-select' onClick={e => setInput("Rent")}>{t("rent")} </button>
          <button className='button-select' onClick={e => setInput("Buy")}>{t("buy")} </button>
        </div>

        <div class=" bg-gray-200 h-2 relative inset-x-0 bottom-20">
          <div class="bg-primary h-2" style={{width: "10%"}}></div>
        </div>
        <button type="submit" onClick={onSubmit} className='absolute bottom-6 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>

      </div>
    </div>
  )
}

export default AddRentBuy