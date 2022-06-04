import React from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Navbar from './Navbar';

const SearchHouse = () => {
  const {state} = useLocation();
  const {t} = useTranslation();
  console.log(state);

  return (
    <div className='w-screen h-screen grid grid-rows-9'>
      <div className='bg-primary flex-flex-row'>
        <Navbar current={t("search-house")} state={state}/>
      </div>
      
    </div>
  )
}

export default SearchHouse