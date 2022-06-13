import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import CustomMap from './CustomMap';
import Carousel from './Carousel';
import { server } from '../services/axios';
import { useAlert } from 'react-alert';
import { reload } from 'firebase/auth';

const Listing = ({state, location, body}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const alert = useAlert();

  const [host, setHost] = useState({});

  state = {...state, id: location._id};

  console.log(body)

  const onReserve = async e => {
    
    const reserveBody = {
      location_id: location._id,
      user_id: state.user._id,
      from: body.start,
      to: body.end,
      status: "Client request",
      completed: false
    }

    try {
      await server.post(`/createConnection`, reserveBody);
      alert.success(`You've made a succesful request for house ${location.title}`);
    } catch (e) {
      console.log(e.message) 
    }


  }

  const handleDelete = async e => {
    e.preventDefault();

    try {
      await server.delete(`/location/${location._id}`);
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    server.get(`/user/${location.host_email}`).then(ret => {setHost(ret.data.user)}); 
  }, []);


  return (
    <div className='rounded-lg shadow-lg bg-white w-80 2xl:w-128 flex flex-col overflow-y-auto scrollbar-hide h-60 2xl:h-164 p-1'>
          
          
          <Carousel location={location} />

          <div className=' pt-6 pb-6 flex justify-between relative'>
            <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
            <h1 className='mr-4 mt-1 text-xl font-bold first-letter:uppercase'>Rating: {location.grade}/10</h1>
            
          </div>
          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className=' pt-6 pb-6 flex justify-between relative'>
            <h1 className='mx-4 text-lg font-semibold first-letter:uppercase'>{location.mode} for {location.price} lei</h1>
            <div className='flex flex-row mr-2'>
              <h1 className='mr-2 text-lg font-semibold first-letter:uppercase'> {host[0]?.first_name}</h1>
              <img class="w-7 h-7 rounded-full mr-1.5 object-contain" src={host[0]?.profile} alt="dummy-image"></img>
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
            {/* <button onClick={() => navigate(`/searchResults/${location._id}`, {state: {location, body}})} type="submit" className='uppercase inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm 2xl:text-xl duration-300 mt-8 text-white py-1 px-4 2xl:px-12 2xl:py-3 rounded-2xl'>{t("open full page")}</button> */}

          </div>

          

          
        </div>
  )
}

export default Listing