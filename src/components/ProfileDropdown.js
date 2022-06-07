import React from 'react'
import { Icon } from '@iconify/react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({user}) => {
  const {t} = useTranslation();
  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();

  return (
    
        <div class="dropdown relative">
          <button
            class="dropdown-toggle px-3 py-1 hover:bg-gray-300 rounded-full text-[#233c3b] hover:text-[#233c3b]/70 flex items-center mr-5"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"  
          >
             <img class="w-8 rounded-full mr-1.5" src={user.profile} alt="dummy-image"></img>
             <span className='text-xl'>{user.first_name}</span>
             <Icon icon="gridicons:dropdown" color="black" height="18"/>
          </button>
          <ul
            class="
              dropdown-menu
              min-w-max
              hidden
              bg-[#ead7ba]
              text-base
              z-50
              float-left
              py-1.5
              list-none
              text-left
              rounded-lg
              shadow-lg
              mt-3
              hidden
              m-0
              bg-clip-padding
              border-none
            "
            aria-labelledby="dropdownMenuButton1"
          >
            <li className='flex items-center mx-6'>
              <p className='text-md font-bold mx-auto'>Grade: 9.34</p>
            </li>
            <hr class="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-1.5
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >{t("update-profile")}</button>
            </li>
            
            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-1.5
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >{t("your-requests")}</button>
            </li>

            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-1.5
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >{t("history")}</button>
            </li>

            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-1.5
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                " onClick={() => logout().then(navigate("/login"))}
                >{t("logout")}</button>
            </li>
          </ul>
        </div>
  )
}

export default ProfileDropdown