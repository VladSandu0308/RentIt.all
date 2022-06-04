import React from 'react'
import { useTranslation } from 'react-i18next';
import logo from '../images/logo.png';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({current, state}) => {
  const {t} = useTranslation();

  return (
    <nav className="basis-full flex items-center flex-wrap mt-1">
      <div className="flex items-center flex-shrink-0 text-white mr-6 ml-2">
        <img className='w-12' src={logo} alt='logo'/>
      </div>
      <div className="w-full block flex-grow flex items-center w-auto">
            <div className="text-sm flex-grow">
              <button className="block inline-block mt-1 text-[#233c3b] hover:text-[#233c3b]/70 mr-4  transition-colors duration-300">
                {t("search-house")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4  transition-colors duration-300">
                {t("host-functions")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4  transition-colors duration-300">
                Blog
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70  transition-colors duration-300">
                Contact
              </button>
            </div>
            <div className='mr-4 flex flex-row'>
              <span className="font-semibold text-xl tracking-tight text-[#233c3b] mr-6 mt-1.5">{current}</span>
              <ProfileDropdown user={state.user} />
            </div>
          </div>
    </nav>
  )
}

export default Navbar