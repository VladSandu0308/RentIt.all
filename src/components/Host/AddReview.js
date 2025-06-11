import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';
import CustomMap from '../CustomMap';

const AddReview = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [error, setError] = useState('');

  console.log(state)

  const onSubmit = async e => {
    e.preventDefault();

    state.body = {...state.body, grade: 0, 
      review_count: 0, host_email: state.user.email, activated: false}
    console.log(state);

    try {
      setError('');
      await server.post("/addLocation", state.body);
      navigate("/host", {state: {user: state.user}});
    } catch (e) {
      setError(e.message);
    }    
  }
  console.log(state.body);
  return (
    <div className='min-w-screen h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='ml-8 m-auto text-5xl font-serif font-bold text-textMain'>
          {t("check-listing")}
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col shadow-3xl'>
        <div className='absolute top-4 right-8 flex items-center gap-3'>
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
          
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate("/host", {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("exit")}</span>
          </button>
        </div>

        <div className='h-164 w-72 2xl:w-96 2xl:h-256 mx-auto p-2 2xl:mx-auto mt-24 mb-10 p-1 flex flex-col overflow-y-auto scrollbar-hide border rounded-2xl border-1'>
          
          <img class="" src={state.body.cover} alt="cover"></img>
          <hr class="h-0 border border-solid border-t-0 border-gray-700 opacity-25" />

          <h1 className='my-8 ml-4 text-2xl font-bold first-letter:uppercase'>{state.body.title}</h1>
          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

          <div className='my-8 flex justify-between'>
            <h1 className='mx-4 text-lg font-semibold first-letter:uppercase'>{t(state.body?.mode?.toLowerCase())} {t("for")} {state.body.price} RON</h1>
            <div className='flex flex-row mr-2'>
              <h1 className='mr-2 text-lg font-semibold first-letter:uppercase'> {state.user.first_name}</h1>
              <img class="w-7 h-7 rounded-full mr-1.5" src={state.user.profile} alt="dummy-image"></img>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <h1 className='my-8 ml-4 text-md first-letter:uppercase'>{state.body.description}</h1>

          <div className='relative'>
            <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
            <h1 className=' mt-8 mx-4 text-md font-semibold first-letter:uppercase'>{t("address")}</h1>
            <h1 className='mt-2 mb-2 mx-4 text-md first-letter:uppercase'>{state.body.location}</h1>
            <div className='mx-auto w-64 h-20 z-50 mb-10'>
              <CustomMap coords={state.body.coords}/>
            </div>
          </div>

          
          
          

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='my-8 flex justify-between'>
            <div className='grid grid-rows-3 gap-1'>
              <h1 className='ml-4 text-md first-letter:uppercase'>{state.body.rooms} {t("min-rooms")} </h1>
              <h1 className='ml-4 text-md first-letter:uppercase'>{state.body.baths} {t("min-baths")} </h1>
              <h1 className='ml-4 text-md first-letter:uppercase'>{state.body.size} m<sup>2</sup> </h1>
            </div>
            <div className=' mr-7 grid grid-rows-3 gap-1'>
              <h1 className='ml-2 text-md first-letter:uppercase'>{state.body.adults} {t("adults")} </h1>
              <h1 className='ml-2 text-md first-letter:uppercase'>{state.body.baths} {t("kids")} </h1>
              <h1 className='text-md first-letter:uppercase flex items-end'>
                <Icon icon={`dashicons:${state.body.furnished}`} color="black" height="24" /> {t("furnished")} 
              </h1>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
          <div className='flex flex-col my-8'>
            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.AC ? 'yes': 'no'}`} color="black" height="18" /> AC
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.heat ? 'yes': 'no'}`} color="black" height="18" /> {t("heat")}
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='mx-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.wifi ? 'yes': 'no'}`} color="black" height="18" /> WiFi 
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.kitchen ? 'yes': 'no'}`} color="black" height="18" /> {t("kitchen")}
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities['parking'] ? 'yes': 'no'}`} color="black" height="18" /> {t("parking")}
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.balcony ? 'yes': 'no'}`} color="black" height="18" /> {t("balcony")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.garden ? 'yes': 'no'}`} color="black" height="18" /> {t("garden")}
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.pool ? 'yes': 'no'}`} color="black" height="18" /> {t("pool")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities['hot tub'] ? 'yes': 'no'}`} color="black" height="18" /> {t("hot-tub")}
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.bbq ? 'yes': 'no'}`} color="black" height="18" /> {t("bbq-grill")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities['bedroom'] ? 'yes': 'no'}`} color="black" height="18" /> {t("room-stuff")}
              </h1>
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities['sports'] ? 'yes': 'no'}`} color="black" height="18" /> {t("sports")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.bathroom ? 'yes': 'no'}`} color="black" height="18" /> {t("bath-stuff")}
              </h1>
              
              <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.pets ? 'yes': 'no'}`} color="black" height="18" /> {t("pets")}
              </h1>
            </div>
            <div className='grid grid-cols-1'>

              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <Icon icon={`dashicons:${state.body.facilities.wash ? 'yes': 'no'}`} color="black" height="18" /> {t("wash")}
              </h1>
            </div>

              
              
          </div>
          
        </div>

        <div class=" bg-gray-200 h-2 inset-x-0">
          <div class="bg-primary h-2" style={{width: "100%"}}></div>

        </div>
        <button type="submit" onClick={onSubmit} className=' 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("submit")}</button>


      </div>
    </div>
  )
}

export default AddReview