import React, { useState } from 'react'
import logo from '../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../services/axios';
import CustomMap from './CustomMap';
import Listing from './Listing';
import Carousel from './Carousel';

const FullPageListing = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [error, setError] = useState('');

  console.log(state)

  const onReserve = async e => {
    
    const reserveBody = {
      location_id: location._id,
      user_id: state.user._id,
      from: state.body.start,
      to: state.body.end,
      status: "Client request",
      completed: false
    }

    try {
      await server.post(`/createConnection`, reserveBody);
      alert.success(`You've made a succesful request for house ${location.title}`);
      navigate('/searchResults', {state});
    } catch (e) {
      console.log(e.message) 
    }


  }

  const [location, setLocation] = useState(state.location)

  return (
    <div className='min-w-screen h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='ml-8 m-auto text-5xl font-serif font-bold text-textMain'>
          Check out this listing :D
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col shadow-3xl'>
        <div className='absolute top-4 right-8 flex items-center gap-3'>
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate('/searchResults', {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
        </div>
        <div className='h-164 w-96 2xl:h-256 mx-auto p-2 2xl:mx-auto mt-24 mb-10 p-1 flex flex-col overflow-y-auto scrollbar-hide border rounded-2xl border-1'>
          
          <Carousel location={location} />

          <div className=' pt-6 pb-6 flex justify-between relative'>
            <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
            <h1 className='mr-4 mt-1 text-xl font-bold first-letter:uppercase'>Rating: {location.grade}/10</h1>
            
          </div>
          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className=' pt-6 pb-6 flex justify-between relative'>
            <h1 className='mx-4 text-lg font-semibold first-letter:uppercase'>{location.mode} for {location.price} lei</h1>
            <div className='flex flex-row mr-2'>
              <h1 className='mr-2 text-lg font-semibold first-letter:uppercase'> {state.host[0]?.first_name}</h1>
              <img class="w-7 h-7 rounded-full mr-1.5 object-contain" src={state.host[0]?.profile} alt="dummy-image"></img>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className=' py-6 flex justify-between relative'>
            <h1 className='ml-4 text-md first-letter:uppercase'>{location.description}</h1>

          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className='relative py-6'>
            
            <h1 className='mx-4 text-md font-semibold first-letter:uppercase'>Location</h1>
            <h1 className='mt-2 mb-4 mx-4 text-md first-letter:uppercase'>{location.location}</h1>
            <div className='mx-auto w-72 h-24 z-50'>
              <CustomMap coords={location.coords}/>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='py-6 flex justify-between relative'>
            <div className='grid grid-rows-3 gap-1'>
              <h1 className='ml-4 text-md first-letter:uppercase'>{location.rooms} bedrooms </h1>
              <h1 className='ml-4 text-md first-letter:uppercase'>{location.baths} bathrooms </h1>
              <h1 className='ml-4 text-md first-letter:uppercase'>{location.size} m<sup>2</sup> </h1>
            </div>
            <div className=' mr-7 grid grid-rows-3 gap-1'>
              <h1 className='ml-2 text-md first-letter:uppercase'>{location.adults} adults </h1>
              <h1 className='ml-2 text-md first-letter:uppercase'>{location.baths} children </h1>
              <h1 className='text-md first-letter:uppercase flex items-end'>
                <Icon icon={`dashicons:${location.furnished}`} color="black" height="24" /> furnished 
              </h1>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='flex flex-col py-6 pb-10 relative'>
            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.AC ? 'yes': 'no'}`} color="black" height="18" /> Air Conditioning
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.heat ? 'yes': 'no'}`} color="black" height="18" /> Heat
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='mx-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.wifi ? 'yes': 'no'}`} color="black" height="18" /> WiFi 
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.kitchen ? 'yes': 'no'}`} color="black" height="18" /> Kitchen
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities['parking'] ? 'yes': 'no'}`} color="black" height="18" /> Free Parking
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.balcony ? 'yes': 'no'}`} color="black" height="18" /> Balcony 
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.garden ? 'yes': 'no'}`} color="black" height="18" /> Garden
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.pool ? 'yes': 'no'}`} color="black" height="18" /> Pool 
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities['hot tub'] ? 'yes': 'no'}`} color="black" height="18" /> Hot Tub
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.bbq ? 'yes': 'no'}`} color="black" height="18" /> BBQ Grill
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities['bedroom'] ? 'yes': 'no'}`} color="black" height="18" /> Bedroom Stuff
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities['sports'] ? 'yes': 'no'}`} color="black" height="18" /> Sport Field
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.bathroom ? 'yes': 'no'}`} color="black" height="18" /> Bathroom Stuff
              </h1>
              
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.pets ? 'yes': 'no'}`} color="black" height="18" /> Pets Allowed
              </h1>
            </div>
            <div className='grid grid-cols-1'>

              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${location.facilities.wash ? 'yes': 'no'}`} color="black" height="18" /> Washing Machine
              </h1>
            </div>
          </div>

          <div className='flex flex-row mx-auto mb-4 gap-2'>
            
            <button onClick={onReserve} type="submit" className='uppercase inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm 2xl:text-xl duration-300 mt-8 text-white py-1 px-4 2xl:px-12 2xl:py-3 rounded-2xl'>{t("reserve")}</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default FullPageListing