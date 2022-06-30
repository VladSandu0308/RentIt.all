import React from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer'
import Navbar from './Navbar'

import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { server } from '../services/axios';

const Contact = () => {
  const {state} = useLocation();
  const {t} = useTranslation();
  
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async data => {
    console.log(data)

    try {
      await server.post("/contact", data);
      navigate("/search", {state});
    } catch (e) {
      console.log(e.message);
    }

  }

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current="Contact" state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary'>
        <div className='flex items-center ml-10 mb-1.5 mt-4'>
            <Icon icon="bxs:contact" color="#3ea1a9" className="mr-2" height="36"/>
            <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("contact")}</h1>
          </div>
          <h4 className='text-black text-lg ml-10 mb-16'>{t("anything-to-tell")}</h4>
          <form className='ml-10 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-row gap-4 mb-8'>
              <div className='basis-1/2 relative flex items-center'>
                <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("first_name")} placeholder={t("first-name")} className='search-text'/>   
              </div>
              <div className='basis-1/2 relative flex items-center'>
                <Icon icon="bi:person-fill" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <input {...register("last_name")} placeholder={t("last-name")} className='search-text'/>  
              </div>
            </div>
            <div className='flex flex-row gap-4 mb-8'>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="fluent:mail-24-filled" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>

                  <input {...register("email")} placeholder="Email" className='search-text'/>
                </div>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="carbon:phone-filled" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>

                  <input {...register("phone")} placeholder={t("phone")} className='search-text'/>               
                </div>
              </div>

                <div className='flex flex-row mb-56 2xl:mb-72 mr-8'>
                  <div className='basis-full relative flex items-center'>
                    <Icon icon="ant-design:message-filled" color="#233c3b" height="24" className='absolute top-1.5 left-2'/>
                        <textarea
                        {...register("message")}
                        class="block big-contact-text pl-10"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        placeholder={t("type-here")}
                      ></textarea>
                  </div>
                  
                </div>
            

            

            <button type="submit" className='absolute bottom-16 2xl:bottom-40 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 mb-4 w-52 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("submit")}</button>

          </form>
      </div>
        
      <div className='bottom-0'>
      <Footer />   
      </div>
       
    </div>
  )
}

export default Contact