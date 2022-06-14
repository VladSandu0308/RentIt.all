import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserAuthContext';

import { Icon } from '@iconify/react';
import logo from '../images/logo.png';
import { useForm } from 'react-hook-form';

import { storage } from '../services/firebase';
import { server } from '../services/axios';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import useUser from '../hooks/useUser';

const UpdateProfile = () => {
  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const {state} = useLocation();
  const { setUser } = useUser();


  const [imageUpload, setImageUpload] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    let body = {...data, ...state.profile}
    console.log(body);

    if(!imageUpload) {
      setError("No picture uploaded");
    }

    if (imageUpload) {
      console.log("Profile picture set");
      const storageRef = ref(storage, `/${currentUser.email}/profile`);
      uploadBytes(storageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          console.log(url);
          body = {...body, profile: url};
          try {
            setError('');
            console.log(body);
            await server.post("/register", body);
            await server.post("/login", {email: body.email}).then(ret => {
              setUser(ret.data.user[0])
              navigate("/search", {state: {user: ret.data.user[0]}});
            })
          } catch (e) {
            setError(e.message);
          }
          
        })
      })
    }

    


  }

  useEffect(() => {
    console.log("Imageee: " + imageUpload?.name);
  }, [imageUpload])

  return (
    <div className='w-screen h-screen grid grid-rows-12'>
      <div className='bg-primary flex justify-between'>
        <img className='mx-2 p-1' src={logo} alt='logo'/>
        <button className='text-md mr-2 bg-inherit text-secondary font-bold rounded-xl px-4 py-0.5 rounded-full hover:text-secondary/80  transition-colors duration-300' onClick={() =>{logout(); setUser(null); navigate("/login")}}>{t("logout")}</button>
      </div>
      <div className='row-span-2 bg-secondary flex justify-between'>
        <div>
          <h2 className='text-[#3ea1a9] text-4xl font-ultra font-bold ml-8 mt-2'>{t("update-info-title")}</h2>
          <h4 className='text-black ml-8'>{t("update-info-subtitle")}</h4>
        </div>
        
        { error && 
              
              <div class="mx-auto mt-2 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20" role="alert">
                <p class="font-bold">{t("error")}</p>
                <p class="text-sm">{error}</p>
              </div>
          }
      </div>
      <div className='row-span-9 bg-secondary grid grid-cols-3'>
        <div className='border-0 border-r-2 border-primary border-solid mb-8 flex flex-col'>
          { imageUpload ? (
            <img src={URL.createObjectURL(imageUpload)} className='max-w-64 max-h-64 mx-auto mt-2' />
          ) : (
            <div className='mx-auto mt-2 w-64 h-64 bg-gray-500 flex rounded-3xl'>
              <Icon icon="bi:person-circle" color="#ddd" height="220" className='m-auto'/>
            </div>
          )}
          
          <label class="text-white font-bold bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-white/50 font-medium rounded-lg text-xs px-5 py-2.5 
              text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-auto mb-4 mt-8">
                <Icon icon="bi:upload" color="#ffffff" className='mr-2' />
                {t("upload-profile-picture")}
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload(e.target.files[0])} ></input>
          </label>

          {
            imageUpload ? (
              <button type="button" class="text-white font-bold bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-white/50 font-medium rounded-lg text-xs px-5 py-2.5 
                  text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-auto mb-2" onClick={() => setImageUpload(null)}>
                    <Icon icon="icomoon-free:bin" color="white" className='mr-2'/>
                    {t("delete-current-profile-picture")}
              </button>
            ) : (
              <></>
            )
          }
          
        </div>
        <form className='col-span-2 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          
          <div class="flex justify-center">
            <div class="mb-3 w-full mx-16 mt-2">
              <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700 italic"
                >{t("say-sth-ab-yourself")}</label>
              <textarea
                {...register("personal_info")}
                class="block big-text"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder={t("type-here")}
              ></textarea>
            </div>
          </div>

          <div class="flex justify-center">
            <div class="mb-3 w-full mx-16 mt-2">
              <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700 italic"
                >{t("your-interest")}</label>
              <textarea
                {...register("interests")}
                class="block big-text"
                id="exampleFormControlTextarea1"
                rows="2"
                placeholder={t("type-here")}
              ></textarea>
            </div>
          </div>

          <div class="flex justify-center">
            <div class="mb-3 w-full mx-16 mt-2">
              <label for="exampleFormControlTextarea1" class="form-label inline-block mb-2 text-gray-700 italic"
                >{t("your-purpose")}</label>
              <textarea
                {...register("purpose")}
                class="block big-text"
                id="exampleFormControlTextarea1"
                rows="2"
                placeholder={t("type-here")}
              ></textarea>
            </div>
          </div>

          <button type="submit" className='bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 mb-4 w-52 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("submit")}</button>

        </form>
      </div>
    </div>
  )
}

export default UpdateProfile