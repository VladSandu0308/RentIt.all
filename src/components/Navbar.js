import React from 'react'
import { useTranslation } from 'react-i18next';
import logo from '../images/logo.png';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({current, state}) => {
  const {t} = useTranslation();

  return (
    <nav className="basis-full flex items-center flex-wrap h-full sticky top-0">
      <div className="flex items-center flex-shrink-0 text-white mr-6 ml-2">
        <img className='w-14' src={logo} alt='logo'/>
      </div>
      <div className="w-full block flex-grow flex items-center w-auto">
            <div className="text-sm flex-grow">
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-lg font-serif transition-colors duration-300">
                {t("search-house")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-lg font-serif  transition-colors duration-300">
                {t("host-functions")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-lg font-serif  transition-colors duration-300">
                Blog
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 text-lg font-serif  transition-colors duration-300">
                Contact
              </button>
            </div>
            <div className='mr-4 flex flex-row items-center'>
              <span className="font-semibold text-xl tracking-tight text-[#233c3b] mr-6">{current}</span>
              <ProfileDropdown user={state.user} />
              <LanguageSelector />
            </div>
          </div>
    </nav>
  )
}

export default Navbar