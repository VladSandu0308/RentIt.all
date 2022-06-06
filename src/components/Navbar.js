import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({current, state}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <nav className="basis-full flex items-center flex-wrap h-full sticky top-0">
      <div className="flex items-center flex-shrink-0 text-white mr-6 ml-2">
        <img className='w-14' src={logo} alt='logo'/>
      </div>
      <div className="w-full block flex-grow flex items-center w-auto">
            <div className="text-sm flex-grow">
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-xl font-serif transition-colors duration-300" onClick={() => navigate("/search", {state})}>
                {t("search-house")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-xl font-serif  transition-colors duration-300" onClick={() => navigate("/hostFunctions", {state})}>
                {t("host-functions")}
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 mr-4 text-xl font-serif  transition-colors duration-300" onClick={() => navigate("/blog", {state})}>
                Blog
              </button>
              <button className="block inline-block text-[#233c3b] hover:text-[#233c3b]/70 text-xl font-serif  transition-colors duration-300" onClick={() => navigate("/contact", {state})}>
                Contact
              </button>
            </div>
            <div className='mr-4 flex flex-row items-center'>
              <span className="font-semibold text-2xl tracking-tight text-[#233c3b] mr-6">{current}</span>
              <ProfileDropdown user={state.user} />
              <LanguageSelector />
            </div>
          </div>
    </nav>
  )
}

export default Navbar