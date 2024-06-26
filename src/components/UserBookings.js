import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { server } from '../services/axios';
import Footer from './Footer'
import Navbar from './Navbar'
import Pagination from './Pagination';
import logo from '../images/logo.png';
import { Icon } from '@iconify/react';
import { useAlert } from 'react-alert';

const now = Date.now();

const UserBookings = () => {
  const {state} = useLocation();
  const {t} = useTranslation();

  const [requests, setRequests] = useState([]);
  const [locations, setLocations] = useState({});
  const [rating, setRating] = useState(1);
  const alert = useAlert();

  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [retMessage, setRetMessage] = useState("");
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleReview = async (id, conn_id) => {
    try {
      await server.put(`/addRatingLocation/${id}/${conn_id}`, {grade: rating})
      alert.success(`Rating given to location ${locations[id].title}`)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (e) {
      console.log(e.message)
    }

  }

  useEffect(() => {
    server.get(`/getUserBookings/${state.user._id}`).then(ret => {
      
      let tempLocations = {}
      setRetMessage(ret.data.message);
      
      for(let i = 0; i < ret.data.requests.length; ++i) {
        server.get(`/getLocation/${ret.data.requests[i].location_id}`).then(ret2 => {
          console.log(ret2)
          //setLocations({...locations, [ret.data.requests[i].location_id]: ret2.data.location})
          
          tempLocations = {...tempLocations, [ret.data.requests[i].location_id]: ret2.data.location}
          

          if(i == ret.data.requests.length - 1) {
            setLocations(tempLocations);
            setRequests(ret.data.requests);
            setRetMessage(ret.data.message);
          }
        })
      } 
    }); 
  }, [reload]);

  const handleDelete = async id => {
    

    try {
      await server.delete(`/deleteRequest/${id}`);
      window.location.reload();

    } catch (e) {
      console.log(e.message)
    }
  }

  
  console.log(locations)

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex'>
        
        <div className='m-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
          <div className="m-auto text-white relative bottom-6 flex items-center">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("your-bookings")}</h1>
          </div>
          
          {
            requests.length == 0 && (
              
                retMessage == "This user has no bookings" ? (
                  <div class="col-span-3 flex items-center justify-center">
                    <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("no-results")}</h1>

                  </div>
                ) : (
                  <div class="col-span-3 flex items-center justify-center">
                    <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )
              
              
            )
          }
          <div className='accordion w-512 h-80' id="accordionRequests">
            {
              currentRequests.map((request) => (
                <div class="accordion-item bg-white border border-gray-200">
                  <h2 class="accordion-header mb-0" id="headingOne">
                    <button class="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b]text-left bg-white border-0 rounded-none transition focus:outline-none;"
                    type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                    aria-controls="collapseOne">
                      {t("booking-for")} {t("location")} {locations[request.location_id]?.title}
                    </button>
                  </h2>
                  <div id={`id${request._id}`}class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                    <div class="accordion-body py-2 px-5 text-sm flex justify-between">
        
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("address")}: {locations[request.location_id]?.location?.match(/[^,]+,[^,]+/g)[0]}</h5>
                          <h5>{t("start-date")}: {request.from?.split('T')[0]} </h5>
                          <h5>{t("end-date")}: {request.to?.split('T')[0]}</h5>
                      </div>
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("min-rooms")}: {locations[request.location_id]?.rooms}</h5>
                          <h5>{t("adults")}: {locations[request.location_id]?.adults} </h5>
                          <h5>{t("kids")}: {locations[request.location_id]?.kids}</h5>
                      </div>
                      
                      <div className='flex ml-4 mr-16 flex-col my-auto gap-1'>
                          <h5>{t("price-range")}: {locations[request.location_id]?.price} RON </h5>
                          <h5>{t("host-email")}: {locations[request.location_id]?.host_email} </h5>
                          <h5>{t("nota")}:  {locations[request.location_id]?.grade}/10 ({locations[request.location_id]?.review_count} {t("note")})</h5>
                      </div>
                      <div className='flex flex-row my-auto '>
                          {
                            new Date(request.to) <= now && (
                              
                                request.reviewed_user ? (
                                  <p className='text-sm flex items-center mr-1'>
                                    {t("reviewed")}
                                  </p> 
                                ) : (
                                  <div className=' relative flex items-center mr-2'>
                                    <Icon icon="akar-icons:star" color="#233c3b" height="16" className='absolute ml-1 select-none'/>
                                    <input onChange={e => setRating(e.target.value)} type="number" min="1" max="10" className=' rating-range w-14 pl-5'/>
                                  </div> 
                                )
                              
                              
                            )
                          }

                          {
                            !request.reviewed_user && (
                              <button className={`w-9 h-9 m-auto rounded-full bg-primary  px-1.5 ${(new Date(request.to) > now || request.reviewed_user) ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary transition-colors duration-300'}`} 
                                onClick={() => handleReview(request.location_id, request._id)}>
                                <Icon icon="ic:baseline-grade" color="#233c3b" height="24" className=''/>
                              </button>
                            )
                          }
                                                   
                          
                      </div>
                    </div>
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
export default UserBookings