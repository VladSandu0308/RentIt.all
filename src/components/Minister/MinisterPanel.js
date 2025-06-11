import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { server } from '../../services/axios';
import { Icon } from '@iconify/react';
import Footer from '../Footer'
import Navbar from '../Navbar'
import Pagination from '../Pagination';
import Carousel from '../Carousel';

const MinisterPanel = () => {
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

  const handleDelete = async location => {
    try {
      await server.delete(`/location/${location._id}`);
      setReload(location._id);
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleEnable = async (location) => {
    if (location._id) {
      try {
        console.log(location);
        await server.put(`/location/${location._id}`, {activated: !location.activated});
        setReload(location)
      } catch (e) {
        console.log(e.message);
      }
    } else {
        console.lo("Unavaialable location")  
    }
  }


  useEffect(() => {
    server.post(`/getLocations/${state.user.email}`, {mode: "Rent"}).then(ret => {setLocations(ret.data.locations)}); 
  }, [reload]);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
      </div>
      <div className='row-span-8 bg-secondary flex flex-col'>
        <button onClick={() => navigate("/admin/blog", {state})} class="w-68 mx-auto mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center">
          <Icon icon="dashicons:welcome-write-blog" color="#233c3b" height="22" className='mr-2 mb-0.5'/>
          <p className='text-textMain text-xl font-semibold uppercase'>{t("add-blog-post")}</p>
        </button>
        <div class="flex justify-around mt-4">
          {
            currentLocations.map((location) => (
              //<OwnListing state={state} location={location} setReload={setReload} />
              <div className='rounded-lg shadow-lg bg-white w-96 flex flex-col overflow-y-auto scrollbar-hide h-128 2xl:h-256 p-1'>
                  <Carousel location={location} />
                  <div className=' pt-6 pb-10 flex justify-between relative'>
                    <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
                    <h1 className='mr-4 mt-1 text-xl font-bold first-letter:uppercase'>{location.mode}</h1>
                  </div>

                  <hr class="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

                  <div className=' pt-6 pb-10 flex justify-between relative'>
                    <iframe
                        src={location.cerere}
                        width="100%"  // Or a specific width
                        height="500px" // Or a specific height
                        title="PDF Viewer" // Add a title for accessibility
                        style={{ border: 'none' }} // Optional: remove the iframe border
                    ></iframe>
                  </div>

                  <div className='flex flex-row mx-auto mb-4 gap-2'>
                    {
                      location.activated ?
                      (
                        <button onClick={() => handleEnable(location)} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("disable")}</button>
                      ) : (
                        <button onClick={() => handleEnable(location)} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("enable")}</button>
                      )
                    }
                    <button onClick={() => handleDelete(location)} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("delete-residence")}</button>

                  </div>
              </div>

              
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

export default MinisterPanel