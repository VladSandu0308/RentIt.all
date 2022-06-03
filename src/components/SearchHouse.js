import React from 'react'
import { useLocation } from 'react-router-dom';

const SearchHouse = () => {
  const {state} = useLocation();

  return (
    <div>
      <img src={URL.createObjectURL(state.user.profile)} className='max-w-64 max-h-64 mx-auto mt-2' />
    </div>
  )
}

export default SearchHouse