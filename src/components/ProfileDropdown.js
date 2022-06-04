import React from 'react'
import { Icon } from '@iconify/react';
import i18next from 'i18next';

const ProfileDropdown = ({user}) => {
  return (
    
        <div class="dropdown relative">
          <button
            class="dropdown-toggle px-3 py-1 hover:bg-gray-300 rounded-full text-[#233c3b] hover:text-[#233c3b]/70 flex items-center"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"  
          >
             <img class="w-8 rounded-full mr-1.5" src={user.profile} alt="dummy-image"></img>
             <span className='text-md'>{user.first_name}</span>
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
              py-2
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
              <p className='text-sm'>Grade: 9.34</p>
            </li>
            <hr class="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-2
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >Update Profile</button>
            </li>
            
            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-2
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >Your request</button>
            </li>

            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-2
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >History</button>
            </li>

            <li>
              <button
                class="
                  dropdown-item
                  text-sm
                  py-2
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
                >Logout</button>
            </li>
          </ul>
        </div>
  )
}

export default ProfileDropdown