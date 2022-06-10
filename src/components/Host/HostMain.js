import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { server } from '../../services/axios';
import { Icon } from '@iconify/react';
import Footer from '../Footer'
import Navbar from '../Navbar'
import Pagination from '../Pagination';
import OwnListing from './OwnListing';
import Carousel from '../Carousel';

const HostMain = () => {
  const {state} = useLocation();
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);

  let currentLocations = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentLocations = locations.length ? locations.slice(firstIndex, lastIndex) : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/getOwnLocations/${state.user.email}`).then(ret => {setLocations(ret.data.locations)}); 
  }, [reload]);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex flex-col'>
          <button onClick={() => navigate("/host/add/mode", {state})} class="w-68 mx-auto mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center">
            <Icon icon="bi:house-door-fill" color="#233c3b" height="20" className='mr-2 mb-0.5'/>
            <p className='text-textMain text-xl font-semibold uppercase'>add new location</p>
          </button>

        <div class="flex justify-around mt-4">
          {
            currentLocations.map((location) => (
              <OwnListing state={state} location={location} setReload={setReload} />
            ))
          }
        </div>

        <div className='bg-secondary mx-auto absolute inset-x-0 bottom-16'>

          <Pagination perPage={perPage} totalPosts={locations.length} paginate={paginate} currentPage={currentPage}/>
        </div>
        
      </div>

      
        
      <div className='bottom-0'>
        <Footer />   
      </div>
       
    </div>
  )
}

export default HostMain