import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';

const SearchHouse = () => {
  const {state} = useLocation();
  const {t} = useTranslation();
  const { register, handleSubmit } = useForm(); 

  const [mode, setMode] = useState("Rent");

  const onSubmit = data => {
    console.log(data);
  }
  console.log(state);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("search-house")} state={state}/>
      </div>
      <div className='row-span-8 bg-secondary'>
        <div className='border-0 border-l-4 border-primary border-solid ml-8 mt-8 pb-6 flex flex-col'>
          <div className='flex items-center ml-10 mb-1.5'>
            <Icon icon="cil:search" color="#3ea1a9" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("search-future-residence")}</h1>
          </div>
          <h4 className='text-black text-lg ml-10 mb-16'>{t("add-search-details")}</h4>
          <form className='ml-10 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-row gap-4 mb-8'>
              <div className='basis-1/4 relative flex items-center'>
                <Icon icon="bi:house-door-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <select {...register("mode")} onChange={e => setMode(e.target.value)} className='select-text focus:outline-none '>
                  <option selected value="Rent">{t("rent")}</option>
                  <option className='' value="Buy">{t("buy")}</option>
                </select>
                <Icon icon="gridicons:dropdown" color="black" height="24" className='right-2 absolute'/>
              </div>
              <div className='basis-3/4 relative flex items-center'>
                <Icon icon="entypo:location-pin" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("location")} placeholder={t("search-location")} className='search-text'>
                </input>
              </div>
            </div>
            {
              mode == "Rent" && 
              <div className='flex flex-row mb-8'>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <input {...register("start")} placeholder='Check In' className='search-text'>
                  </input>
                </div>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <input {...register("end")} placeholder='Check Out' className='search-text'>
                  </input>
                </div>
              </div>
            }

            {
              mode == "Rent" ? (
                <div className='flex flex-row mb-28 2xl:mb-48'>
                  <div className='basis-1/2 relative flex items-center'>
                    <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                    <input {...register("adults")} placeholder={t("adults-count")} className='search-text'>
                    </input>
                  </div>
                  <div className='basis-1/2 relative flex items-center'>
                    <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                    <input {...register("kids")} placeholder={t("kids-count")} className='search-text'>
                    </input>
                  </div>
                </div>
              ) : (
                <div className='flex flex-row mb-48 2xl:mb-72'>
                  <div className='basis-1/2 relative flex items-center'>
                    <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                    <input {...register("adults")} placeholder={t("adults-count")} className='search-text'>
                    </input>
                  </div>
                  <div className='basis-1/2 relative flex items-center'>
                    <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                    <input {...register("kids")} placeholder={t("kids-count")} className='search-text'>
                    </input>
                  </div>
                </div>
              )
            }
            

            

            <button type="submit" className='absolute bottom-10 2xl:bottom-16 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 mb-4 w-52 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("submit")}</button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default SearchHouse