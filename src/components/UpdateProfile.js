import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserAuthContext';

import { Icon } from '@iconify/react';
import logo from '../images/logo.png';

const UpdateProfile = () => {
  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    console.log("Imageee: " + imageUpload.name);
  }, [imageUpload])

  return (
    <div className='w-screen h-screen grid grid-rows-12'>
      <div className='bg-primary flex justify-between'>
        <img className='mx-2 p-1' src={logo} alt='logo'/>
        <button className='text-md mr-2 bg-inherit text-secondary font-bold rounded-xl px-4 py-0.5 rounded-full hover:text-secondary/80  transition-colors duration-300' onClick={() => logout().then(navigate("/login"))}>{t("logout")}</button>
      </div>
      <div className='row-span-2 bg-secondary'>
        <h2 className='text-[#3ea1a9] text-4xl font-ultra font-bold ml-8 mt-2'>{t("update-info-title")}</h2>
        <h4 className='text-black ml-8'>{t("update-info-subtitle")}</h4>
      </div>
      <div className='row-span-9 bg-secondary grid grid-cols-3'>
        <div className='border-0 border-r-2 border-primary border-solid mb-8 flex flex-col'>
          <div className='mx-auto mt-2 w-64 h-64 bg-gray-500 flex rounded-3xl'>
            <Icon icon="bi:person-circle" color="#ddd" height="220" className='m-auto'/>
          </div>
          <label class="text-white font-bold bg-[#4CA9AF] hover:bg-[#4CA9AF]/80 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-white/50 font-medium rounded-lg text-xs px-5 py-2.5 
              text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-auto mb-2 mt-8">
                <Icon icon="bi:upload" color="#ffffff" className='mr-2' />
                {t("upload-profile-picture")}
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload(e.target.files[0])} ></input>

          </label>
        </div>
        <div className='col-span-2'>

        </div>
      </div>
    </div>
  )
}

export default UpdateProfile