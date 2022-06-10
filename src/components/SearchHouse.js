import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import Footer from './Footer';

import useInput from '../hooks/useInput';
import { Datepicker } from '@mobiscroll/react';

const SearchHouse = () => {
  let {state} = useLocation();
  const {t} = useTranslation();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [mode, setMode] = useState("Rent");

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const [location, setLocation] = useState();
  const [coords, setCoords] = useState();

  const address = useInput("");

  const onSubmit = data => {
    const startDate = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().slice(0, 11).replace('T', ' ');
    const endDate = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().slice(0, 11).replace('T', ' ')
    const body = {...data, startDate, endDate, location, coords}

    state = {...state, body}
    navigate('/searchResults', {state});

  }
  console.log(state);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("search-house")} state={state} className="z-20"/>
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
                <Icon icon="entypo:location-pin" color="#233c3b" height="24" className='absolute ml-2 pb-0.5 z-0'/>
                <input value={location} autoComplete="off" placeholder={t("search-location")} className='search-text' onChange={e => {setLocation(e.target.value); address.onChange(e);}}/>
                  {
                      address.suggestions?.length > 0 && (
                        <div className='bg-[#aad0d3] absolute top-12 w-128 py-2 px-1 z-10 rounded-2xl'>
                          {
                            address.suggestions.map((suggestion, index) => {
                              return (
                                <p className='cursor-pointer hover:bg-[#ecf0f0] max-w-96 py-1 text-xs' key={index} onClick={() => {
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
            {
              mode == "Rent" && 
              <div className='flex flex-row mb-8'>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <Datepicker value={start} onChange={e => setStart(e.value)} controls={['calendar']} touchUi={true} display='anchored' min={new Date()} inputComponent="input" inputProps={{placeholder: 'Start Date', class: 'search-date'}}/>
                </div>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <Datepicker value={end} onChange={e => setEnd(e.value)}  controls={['calendar']} display='anchored' min={start} touchUi={true} inputComponent="input" inputProps={{placeholder: 'End Date', class: 'search-date'}} />
                </div>
              </div>
            }

            {
              mode == "Rent" ? (
                <div className='flex flex-row mb-36 2xl:mb-48'>
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
                <div className='flex flex-row mb-56 2xl:mb-72'>
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
            

            

            <button type="submit" className='absolute bottom-16 2xl:bottom-40 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 mb-4 w-52 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("submit")}</button>

          </form>
        </div>
        
      </div>
      <div className='bottom-0'>
      <Footer />   
      </div>
       
    </div>
  )
}

export default SearchHouse