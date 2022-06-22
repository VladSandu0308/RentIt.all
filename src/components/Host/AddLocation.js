import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomMap from '../CustomMap';
import useInput from '../../hooks/useInput';
import { server } from '../../services/axios';

const AddLocation = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();
  
  const [location, setLocation] = useState();
  const [coords, setCoords] = useState();

  const address = useInput("");
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    if (state.id && location) {
      try {
        setError('');
        await server.put(`/location/${state.id}`, {location, coords});
        navigate("/host", {state: {user: state.user}});
      } catch (e) {
        setError(e.message);
      }
    } else {
      if (!location) {
        setError("Please insert location")
      } else {
        state.body = {...state.body,  location, coords};

        navigate("/host/add/guests", {state});
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
        {t("add-location")}
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
        <div className='mb-20 flex relative w-full h-full'>
          <CustomMap coords={coords}/>
          <div className='absolute top-3 left-4'>
            <Icon icon="entypo:location-pin" color="#233c3b" height="24" className='absolute ml-2 top-3 pb-0.5 z-0'/>
            <input value={location} autoComplete="off" class="search-text" id="name" placeholder={t("add-location")} onChange={e => {setLocation(e.target.value); address.onChange(e);}}/>
                  {
                      address.suggestions?.length > 0 && (
                        <div className='bg-white absolute w-96 py-4 px-1 z-10'>
                          {
                            address.suggestions.map((suggestion, index) => {
                              return (
                                <p className='cursor-pointer max-w-96 py-1 text-xs' key={index} onClick={() => {
                                  address.setValue(suggestion.place_name);
                                  address.setSuggestions([]);
                                  setLocation(suggestion.place_name);
                                  setCoords(suggestion.center);
                                }} >
                                  {suggestion.place_name}
                                </p>
                              )
                            })
                          }
                        </div>
                      )
                  }
          </div>
        </div>

        <div class=" bg-gray-200 h-2 relative inset-x-0 bottom-20">
          <div class="bg-primary h-2" style={{width: "40%"}}></div>
        </div>
        <button type="submit" onClick={onSubmit} className='absolute bottom-6 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>

      </div>
    </div>
  )
}

export default AddLocation