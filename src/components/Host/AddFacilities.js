import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';

const AddFacilities = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState({
    'AC': false,
    'heat': false,
    'wifi': false,
    'kitchen': false,
    'wash': false,
    'balcony': false,
    'garden': false,
    'pool': false,
    'hot tub': false,
    'bbq': false,
    'sports': false,
    'parking': false,
    'pets': false,
    'bedroom': false,
    'bathroom': false,
  });
  const [error, setError] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    if (state.id && input) {
      try {
        setError('');
        await server.put(`/location/${state.id}`, {facilities: input});
        navigate("/host", {state: {user: state.user}});
      } catch (e) {
        setError(e.message);
      }
    } else {
      if (!input) {
        setError("Please insert facilities")
      } else {
        state.body = {...state.body, facilities: input}

        navigate("/host/add/furnished", {state});
      }
     
    }
  }

  console.log(input);

  return (
    <div className='min-w-screen h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='ml-8 m-auto text-5xl font-serif font-bold text-textMain'>
        {t("facilities")}
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col'>
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

        <div className='h-128 2xl:h-256 ml-8 2xl:mx-auto mt-32 mb-10 p-1 flex flex-col overflow-y-auto scrollbar-hide'>
          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'AC': !input['AC']}; setInput({...input, ...body})}} class={`facilities-box ${input['AC'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="iconoir:air-conditioner" color="#233c3b" height="24"/>
              <span class="mt-2 text-sm text-textMain">AC</span>
            </button>

            <button onClick={() => {const body = {'heat': !input['heat']}; setInput({...input, ...body})}} class={`facilities-box ${input['heat'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="material-symbols:mode-heat" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("heat")}</span>
            </button>

            <button onClick={() => {const body = {'wifi': !input['wifi']}; setInput({...input, ...body})}} class={`facilities-box ${input['wifi'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="akar-icons:wifi" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">WiFi</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'kitchen': !input['kitchen']}; setInput({...input, ...body})}} class={`facilities-box ${input['kitchen'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="ic:baseline-kitchen" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">{t("kitchen")}</span>
            </button>

            <button onClick={() => {const body = {'wash': !input['wash']}; setInput({...input, ...body})}} class={`facilities-box ${input['wash'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park-solid:washing-machine-one" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("wash")}</span>
            </button>

            <button onClick={() => {const body = {'balcony': !input['balcony']}; setInput({...input, ...body})}} class={`facilities-box ${input['balcony'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park:terrace" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("balcony")}</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'garden': !input['garden']}; setInput({...input, ...body})}} class={`facilities-box ${input['garden'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="maki:garden" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">{t("garden")}</span>
            </button>

            <button onClick={() => {const body = {'pool': !input['pool']}; setInput({...input, ...body})}} class={`facilities-box ${input['pool'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park:swimming-pool" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("pool")}</span>
            </button>

            <button onClick={() => {const body = {'hot tub': !input['hot tub']}; setInput({...input, ...body})}} class={`facilities-box ${input['hot tub'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="material-symbols:hot-tub-outline-sharp" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("hot-tub")}</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>

            <button onClick={() => {const body = {'bbq': !input['bbq']}; setInput({...input, ...body})}} class={`facilities-box ${input['bbq'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="maki:bbq" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("bbq-grill")}</span>
            </button>


            <button onClick={() => {const body = {'parking': !input['parking']}; setInput({...input, ...body})}} class={`facilities-box ${input['parking'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="fa-solid:parking" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">{t("parking")}</span>
            </button>

            

            <button onClick={() => {const body = {'sports': !input['sports']}; setInput({...input, ...body})}} class={`facilities-box ${input['sports'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="ic:baseline-sports-basketball" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("sports")}</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'bedroom': !input['bedroom']}; setInput({...input, ...body})}} class={`facilities-box ${input['bedroom'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park-solid:towel" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">{t("room-stuff")}</span>
            </button>

            <button onClick={() => {const body = {'bathroom': !input['bathroom']}; setInput({...input, ...body})}} class={`facilities-box ${input['bathroom'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="jam:hairdryer-f" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("bath-stuff")}</span>
            </button>

            <button onClick={() => {const body = {'pets': !input['pets']}; setInput({...input, ...body})}} class={`facilities-box ${input['pets'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="ic:twotone-pets" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">{t("pets")}</span>
            </button>
          </div>
          
        </div>

        <div class=" bg-gray-200 h-2 inset-x-0">
          <div class="bg-primary h-2" style={{width: "60%"}}></div>

        </div>
        <button type="submit" onClick={onSubmit} className=' 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>


      </div>
    </div>
  )
}

export default AddFacilities