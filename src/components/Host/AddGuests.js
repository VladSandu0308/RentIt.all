import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';

const AddGuests = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [baths, setBaths] = useState(0);
  const [size, setSize] = useState(1);
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    if (state.id && adults && kids && baths && size) {
      try {
        setError('');
        await server.put(`/location/${state.id}`, {adults, kids, rooms, baths, size});
        navigate("/host", {state: {user: state.user}});
      } catch (e) {
        setError(e.message);
      }
    } else {
      if (!adults || !kids || !rooms || !baths || !size) {
        setError("Please insert all info")
      } else {
        state.body = {...state.body, adults, kids, rooms, baths, size}
        console.log(state);

        navigate("/host/add/facilities", {state});
      }
     
    }
  }

  return (
    <div className='min-w-screen min-h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='my-auto mx-8 text-5xl font-serif font-bold text-textMain'>
          Add the location capacity
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
            <span className='text-lg font-serif'>Exit</span>
          </button>
          { error && 
              
              <div class="mx-auto mt-14 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20 absolute inset-x-56 top-0" role="alert">
                <p class="font-bold">{t("error")}</p>
                <p class="text-sm">{error}</p>
              </div>
          }
        </div>
        <div className='ml-5 my-auto flex flex-col'>
          <div className='mb-8 relative flex'>
            <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 top-3'/>
            <input type="number" min="1" placeholder={t("adults-count")} className='search-text pr-3' onChange={e => setAdults(e.target.value)}/>
          </div>
          <div className='mb-8 relative flex'>
            <Icon icon="cil:child" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 top-3'/>
            <input type="number" min="1" placeholder={t("kids-count")} className='search-text pr-3' onChange={e => setKids(e.target.value)}/>
          </div>
          <div className='mb-8 relative flex'>
            <Icon icon="ic:baseline-bedroom-child" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 top-3'/>
            <input type="number" min="1" placeholder={t("rooms-count")} className='search-text pr-3' onChange={e => setRooms(e.target.value)}/>
          </div>
          <div className='relative flex mb-8'>
            <Icon icon="ic:baseline-bathroom" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 top-3'/>
            <input type="number" min="1" placeholder={t("bathrooms-count")} className='search-text pr-3' onChange={e => setBaths(e.target.value)}/>
          </div>
          <div className='relative flex'>
          <Icon icon="ion:resize-outline" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 top-3'/>
            <input type="number" step="0.1" min="10" placeholder={t("house-size")} className='search-text pr-3' onChange={e => setSize(e.target.value)}/>
          </div>


          
          
        </div>

        <div class="bg-gray-200 h-2 relative inset-x-0 bottom-20">
          <div class="bg-primary h-2" style={{width: "50%"}}></div>
        </div>
        <button type="submit" onClick={onSubmit} className='absolute bottom-6 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>

      </div>
    </div>
  )
}

export default AddGuests