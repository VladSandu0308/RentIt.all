
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { server } from '../services/axios';
import { Icon } from '@iconify/react';
import Footer from './Footer';
import OwnListing from './Host/OwnListing';
import Listing from './Listing';
import Navbar from './Navbar';
import Pagination from './Pagination';

const SearchResults = () => {
  let {state} = useLocation();
  const {t} = useTranslation();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);

  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);

  let currentLocations = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentLocations = locations?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  

  useEffect(() => {
    server.get(`/getLocations/${state.user.email}`).then(ret => {console.log(ret); setLocations(ret.data.locations)}).then(() => {console.log(locations)}); 
  }, []);


  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("search-house")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary grid grid-cols-4'>
        
        <div class="col-span-3 ">
          <div className='flex items-center ml-4 mb-3'>
            <Icon icon="cil:search" color="#3ea1a9" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("your-results")} {state.body.location?.split(',')[0]}</h1>
          </div>

          <div className='grid grid-cols-3 mt-2 ml-4 gap-4 relative'>
            {
              currentLocations.map((location) => (
                <Listing state={state} location={location} />
              ))
            }
            <div className='bg-secondary absolute inset-x-0 -bottom-12'>

              <Pagination perPage={perPage} totalPosts={locations.length} paginate={paginate} currentPage={currentPage}/>
            </div>
          </div>
          
          
        </div>
        <div className='bg-primary flex flex-col'>
          <h1 className='ml-6 mb-6 mt-2 mb-10 font-bold text-[#233c3b] hover:text-[#233c3b]/70 mr-6 text-3xl font-serif transition-colors duration-300'>Select Filters</h1>
          <h1 className='ml-6 text-[#233c3b] hover:text-[#233c3b]/70 mr-6 text-lg font-serif transition-colors duration-300'>Price Range (/night)</h1>

          <div className='flex justify-around mb-6 mx-auto gap-6 mt-3'>

            <div className='mx-auto my-auto relative flex items-center'>
              <Icon icon="healthicons:money-bag" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input type="number" step="5" min="50" placeholder={t("min-price")} className='price-range w-36 h-12 pr-1 pl-8'/>
            </div>

            <div className='mx-auto my-auto relative flex items-center gap-20'>
              <Icon icon="healthicons:money-bag" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input type="number" step="5" min="50" placeholder={t("max-price")} className='price-range w-36 h-12 pr-1 pl-8'/>
            </div>
          </div>

          <h1 className='ml-6 text-[#233c3b] hover:text-[#233c3b]/70 mr-6 text-lg font-serif transition-colors duration-300'>Max distance from search point (km)</h1>
          <div className='mt-3 mx-auto relative flex items-center gap-20'>
          <Icon icon="icon-park-outline:map-distance" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input type="number" step="2" min="1" max="200" placeholder={t("max-distance")} className='price-range w-56 h-12 pr-1'/>
          </div>
        </div>

        
      </div>
       
    </div>
  )
}

export default SearchResults