import React from 'react'
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import CustomMap from '../CustomMap';
import Carousel from '../Carousel';
import { server } from '../../services/axios';

const OwnListing = ({state, location, setReload}) => {
  console.log(location)
  const { t } = useTranslation();
  console.log(state)
  const navigate = useNavigate();

  state = {...state, id: location._id};

  const handleDelete = async e => {
    e.preventDefault();

    try {
      await server.delete(`/location/${location._id}`);
      setReload(location._id);
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div className='rounded-lg shadow-lg bg-white w-96 flex flex-col overflow-y-auto scrollbar-hide h-128 2xl:h-256 p-1'>
          
          {/* <img class="rounded-t-lg w-full h-48 object-cover" src={location.cover} alt="cover"></img> */}
          <Carousel location={location} />

          <div className=' pt-6 pb-10 flex justify-between relative'>
            <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
            <h1 className='mr-4 mt-1 text-xl font-bold first-letter:uppercase'>Rating: {location.grade}/10</h1>
            <button onClick={() => navigate("/host/add/title", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>
          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className=' pt-6 pb-10 flex justify-between relative'>
            <h1 className='mx-4 text-lg font-semibold first-letter:uppercase'>{location.mode} for {location.price} lei</h1>
            <div className='flex flex-row mr-2'>
              <h1 className='mr-2 text-lg font-semibold first-letter:uppercase'> {state.user.first_name}</h1>
              <img class="w-7 h-7 rounded-full mr-1.5" src={state.user.profile} alt="dummy-image"></img>
            </div>
            <button onClick={() => navigate("/host/add/price", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className=' pt-6 pb-10 flex justify-between relative'>
            <h1 className='ml-4 text-md first-letter:uppercase'>{location.description}</h1>
            <button onClick={() => navigate("/host/add/description", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className='relative pt-6 pb-10'>
            
            <h1 className='mx-4 text-md font-semibold first-letter:uppercase'>Location</h1>
            <h1 className='mt-2 mb-4 mx-4 text-md first-letter:uppercase'>{location.location}</h1>
            <div className='mx-auto w-80 h-24 z-50'>
              <CustomMap coords={location.coords}/>
            </div>

            <button onClick={() => navigate("/host/add/location", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='pt-6 pb-10 flex justify-between relative'>
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
            <button onClick={() => navigate("/host/add/guests", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='flex flex-col pt-6 pb-10 relative'>
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

              
            <button onClick={() => navigate("/host/add/facilities", {state})} class="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
              <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
            </button>
          </div>

          <div className='flex flex-row mx-auto mb-4 gap-2'>
            <button onClick={() => navigate(`/bookings/${location._id}`, {state})} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("current-bookings")}</button>
            <button onClick={() => navigate(`/locationRequests/${location._id}`, {state: {user: state.user, location:location}})} type="submit" className='inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("requests")}</button>
            <button onClick={handleDelete} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("delete-residence")}</button>

          </div>

          

          
        </div>
  )
}

export default OwnListing