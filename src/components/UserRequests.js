import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { server } from '../services/axios';
import Footer from './Footer'
import Navbar from './Navbar'
import Pagination from './Pagination';
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';

const UserRequests = () => {
  const {state} = useLocation();
  const {t} = useTranslation();

  const [requests, setRequests] = useState([]);
  const [locations, setLocations] = useState({});

  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/getUserRequests/${state.user._id}`).then(ret => {
      
      let tempLocations = {}
      
      for(let i = 0; i < ret.data.requests.length; ++i) {
        server.get(`/getLocation/${ret.data.requests[i].location_id}`).then(ret2 => {
          console.log(ret2)
          //setLocations({...locations, [ret.data.requests[i].location_id]: ret2.data.location})
          
          tempLocations = {...tempLocations, [ret.data.requests[i].location_id]: ret2.data.location}
          

          if(i == ret.data.requests.length - 1) {
            setLocations(tempLocations)
            setRequests(ret.data.requests)
          }
        })
      } 
    }); 
  }, []);

  // useEffect(() => {
  //   for(let i = 0; i < currentRequests.length; ++i) {
  //     server.get(`/getLocation/${currentRequests[i].location_id}`).then(ret => {
  //       locations = {...locations, [currentRequests[i].location_id]: ret.data.location}
  //     })
  //   }
  //   console.log(locations)
  // }, [requests])

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex'>
        
        <div className='m-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
          <div className="m-auto text-white relative bottom-6 flex items-center">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("your-requests")}</h1>
          </div>
          {
            requests.length == 0 && (
              <div class="col-span-3 flex items-center justify-center">
                  <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
            )
          }
          <div className='accordion' id="accordionRequests">
            {
              currentRequests.map((request) => (
                <div class="accordion-item bg-white border border-gray-200">
                  <h2 class="accordion-header mb-0" id="headingOne">
                    <button class="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b]text-left bg-white border-0 rounded-none transition focus:outline-none;"
                    type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                    aria-controls="collapseOne">
                      Request for location {locations[request.location_id].title}
                    </button>
                  </h2>
                  <div id={`id${request._id}`}class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                    LALALA
                  </div>
                </div>
              ))
            }
          </div>
          <Pagination perPage={perPage} totalPosts={requests.length} paginate={paginate} currentPage={currentPage}/>
        </div>
      </div>
        
      <div className='bottom-0'>
        <Footer />   
      </div>
       
    </div>
  )
}
export default UserRequests