import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddFacilities = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState({
    "AC": 0,
    "Pool": 0
  });
  const [counter, setCounter] = useState(1);

  const onSubmit = e => {
    e.preventDefault();

    state.body = {...state.body, description: input}
    console.log(state);

    //navigate("/host/add/location", {state});


  }

  console.log(input);

  return (
    <div className='min-w-screen h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='ml-8 m-auto text-5xl font-serif font-bold text-textMain'>
          Add your facilities
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col'>
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

        <div className='h-128 ml-8 mt-32 mb-10 p-1 flex flex-col overflow-y-auto'>
          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'AC': !input['AC']}; setInput({...input, ...body})}} class={`facilities-box ${input['AC'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="iconoir:air-conditioner" color="#233c3b" height="24"/>
              <span class="mt-2 text-sm text-textMain">Air Conditioning</span>
            </button>

            <button onClick={() => {const body = {'heat': !input['heat']}; setInput({...input, ...body})}} class={`facilities-box ${input['heat'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="material-symbols:mode-heat" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Heat</span>
            </button>

            <button onClick={() => {const body = {'wifi': !input['wifi']}; setInput({...input, ...body})}} class={`facilities-box ${input['wifi'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="akar-icons:wifi" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Free WiFi</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'kitchen': !input['kitchen']}; setInput({...input, ...body})}} class={`facilities-box ${input['kitchen'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
              <Icon icon="ic:baseline-kitchen" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">Kitchen</span>
            </button>

            <button onClick={() => {const body = {'wash': !input['wash']}; setInput({...input, ...body})}} class={`facilities-box ${input['wash'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park-solid:washing-machine-one" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Washing Machine</span>
            </button>

            <button onClick={() => {const body = {'balcony': !input['balcony']}; setInput({...input, ...body})}} class={`facilities-box ${input['balcony'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park:terrace" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Balcony</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'garden': !input['garden']}; setInput({...input, ...body})}} class={`facilities-box ${input['garden'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="maki:garden" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">Garden</span>
            </button>

            <button onClick={() => {const body = {'pool': !input['pool']}; setInput({...input, ...body})}} class={`facilities-box ${input['pool'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park:swimming-pool" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Swimming Pool</span>
            </button>

            <button onClick={() => {const body = {'hot tub': !input['hot tub']}; setInput({...input, ...body})}} class={`facilities-box ${input['hot tub'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="material-symbols:hot-tub-outline-sharp" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Hot Tub</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>

            <button onClick={() => {const body = {'bbq': !input['bbq']}; setInput({...input, ...body})}} class={`facilities-box ${input['bbq'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="maki:bbq" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">BBQ Grill</span>
            </button>


            <button onClick={() => {const body = {'parking': !input['parking']}; setInput({...input, ...body})}} class={`facilities-box ${input['parking'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="fa-solid:parking" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">Free Parking</span>
            </button>

            

            <button onClick={() => {const body = {'sports': !input['sports']}; setInput({...input, ...body})}} class={`facilities-box ${input['sports'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="ic:baseline-sports-basketball" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Sports Field</span>
            </button>
          </div>

          <div className='flex flex-row mb-6'>
            <button onClick={() => {const body = {'bedroom': !input['bedroom']}; setInput({...input, ...body})}} class={`facilities-box ${input['bedroom'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="icon-park-solid:towel" color="#233c3b" height="24" />
              <span class="mt-2 text-sm text-textMain">Bedroom Stuff</span>
            </button>

            <button onClick={() => {const body = {'bathroom': !input['bathroom']}; setInput({...input, ...body})}} class={`facilities-box ${input['bathroom'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="jam:hairdryer-f" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Bath Stuff</span>
            </button>

            <button onClick={() => {const body = {'pets': !input['pets']}; setInput({...input, ...body})}} class={`facilities-box ${input['pets'] ? 'bg-secondary ring-primary ring-4 outline-none' : 'bg-primary/70 bg-clip-padding border border-solid border-gray-300'}`}>
            <Icon icon="ic:twotone-pets" color="#233c3b" height="24" />
              <span class="mt-2 text-sm leading-normal text-textMain">Pets Allowed</span>
            </button>
          </div>
          
        </div>

        <div class=" bg-gray-200 h-2 inset-x-0">
          <div class="bg-primary h-2" style={{width: "20%"}}></div>

        </div>
        <button type="submit" onClick={onSubmit} className=' 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>


      </div>
    </div>
  )
}

export default AddFacilities