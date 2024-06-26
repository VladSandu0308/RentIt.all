import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { server } from '../../services/axios';
import Footer from '../Footer'
import Navbar from '../Navbar'
import Pagination from '../Pagination';
import { Icon } from '@iconify/react';

import { useAlert } from 'react-alert';

const LocationRequests = () => {
  const {state} = useLocation();
  console.log(state);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const alert = useAlert();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});

  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [retMessage, setRetMessage] = useState("");
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/getLocationRequests/${state.location._id}`).then(ret => {
      
      let tempUsers = {}
      console.log(ret)
      setRetMessage(ret.data.message);
      
      for(let i = 0; i < ret?.data?.requests?.length; ++i) {
        server.get(`/getUserById/${ret.data.requests[i].user_id}`).then(ret2 => {
          console.log(ret2)
          //setLocations({...locations, [ret.data.requests[i].location_id]: ret2.data.location})
          
          tempUsers = {...tempUsers, [ret.data.requests[i].user_id]: ret2.data.user}
          

          if(i == ret.data.requests.length - 1) {
            setUsers(tempUsers)
            setRequests(ret.data.requests)
            
          }
        })
      } 
    }); 
  }, []);

  const handleAccept = async (id, email, name, from, to) => {
    try {
      await server.put(`/acceptConnection/${id}`, {email, location_title: state.location.title});
      alert.success(`Succesfully accepted request for user ${name} starting from ${from} to ${to}`);
      navigate('/host', {state});

    } catch (e) {
      console.log(e.message)
    }
  }

  const handleDelete = async (id, name, from, to) => {
    try {
      await server.put(`/rejectConnection/${id}`);
      window.location.reload()
      alert.success(`Succesfully deleted request for user ${name} starting from ${from} to ${to}`);
      

    } catch (e) {
      console.log(e.message)
    }
  }

  console.log(retMessage);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex'>
          <button class="absolute mt-4 left-5 px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
        <div className='m-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
          <div className="m-auto text-white relative bottom-6 flex items-center">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("Location-requests")}</h1>
          </div>
          {
            requests.length == 0 && (
              
                retMessage == "This location has no requests" ? (
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
                      Request from {users[request.user_id]?.first_name}
                    </button>
                  </h2>
                  <div id={`id${request._id}`}class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                    <div class="accordion-body py-2 px-5 text-sm flex justify-between">
          
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("full-name")}: {users[request.user_id].first_name} {users[request.user_id].last_name}</h5>
                          {
                            state.location.mode == "Rent" && (
                              <h5>{t("start-date")}: {request.from?.split('T')[0]} </h5>
                            )
                          }
                          {
                            state.location.mode == "Rent" && (
                              <h5>{t("end-daet")}: {request.to?.split('T')[0]} </h5>
                            )
                          }
                          
                         
                      </div>
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("nota")}:  {users[request.user_id].grade}/10 ({users[request.user_id].review_count} {t("note")})</h5>
                          <h5>Email: {users[request.user_id].email} </h5>
                          <h5>{t("phone")}: {users[request.user_id].phone}</h5>
                      </div>
                      
                      <div className='flex ml-4 mr-16 flex-col my-auto gap-1'>
                          <h5>{t("personal-info")}: {users[request.user_id].personal_info} </h5>
                          <h5>{t("purpsoe")}: {users[request.user_id].purpose} </h5>
                          <h5>{t("interests")}:  {users[request.user_id].interests}</h5>
                      </div>
                      <div className='flex flex-row gap-4 my-auto mr-4'>
                        <button className='w-9 h-9 m-auto rounded-full bg-primary hover:bg-secondary transition-colors duration-300 px-1.5' 
                          onClick={() => {handleAccept(request._id, users[request.user_id].email, users[request.user_id].first_name, request.from?.split('T')[0], request.to?.split('T')[0])}}>
                          <Icon icon="dashicons:yes" color="#233c3b" height="24" className=''/>
                        </button>

                        <button className='w-9 h-9 m-auto rounded-full bg-primary hover:bg-secondary transition-colors duration-300 px-1.5' 
                          onClick={() => {handleDelete(request._id, users[request.user_id].first_name, request.from?.split('T')[0], request.to?.split('T')[0])}}>
                          <Icon icon="dashicons:no" color="#233c3b" height="24" className=''/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
            {
              requests.length != 0 &&
                <Pagination perPage={perPage} totalPosts={requests.length} paginate={paginate} currentPage={currentPage}/>

            }        
        </div>
      </div>
        
      <div className='bottom-0'>
        <Footer />   
      </div>
       
    </div>
  )
}
export default LocationRequests