import React from 'react'
import { Icon } from '@iconify/react';
import i18next from 'i18next';

const LanguageSelector = () => {
  return (
    <div class="flex justify-center">
      <div>
        <div class="dropdown relative">
          <button
            class="dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            
          >
            <Icon icon="fa-solid:globe" color="#ead7ba" height="28"/>
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
              mt-1
              hidden
              m-0
              bg-clip-padding
              border-none
            "
            aria-labelledby="dropdownMenuButton1"
          >
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
                onClick={() => i18next.changeLanguage("en")}
                >English</button>
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
                onClick={() => i18next.changeLanguage("ro")}
                >Romana</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector