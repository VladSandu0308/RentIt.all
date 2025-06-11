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

const UserRequests = () => {
  const {state} = useLocation();
  const {t} = useTranslation();
  const alert = useAlert();

  const [requests, setRequests] = useState([]);
  const [locations, setLocations] = useState({});

  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [retMessage, setRetMessage] = useState("");
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const getRequestStatusColor = (status) => {
    if (status === 'Client request') return 'text-blue-600';
    if (status === 'Request rejected by host') return 'text-red-600';
    if (status === 'Request rejected because of conflict') return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRequestStatusIcon = (status) => {
    if (status === 'Client request') return 'material-symbols:pending';
    if (status === 'Request rejected by host') return 'material-symbols:cancel';
    if (status === 'Request rejected because of conflict') return 'material-symbols:schedule';
    return 'material-symbols:help';
  };

  const canDeleteRequest = (request) => {
    // Poate șterge doar request-urile pending sau rejected
    return request.status === 'Client request' || 
           request.status.includes('rejected');
  };

  useEffect(() => {
    server.get(`/getUserRequests/${state.user._id}`).then(ret => {
      
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
      alert.success('Request deleted successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.log(e.message);
      alert.error('Failed to delete request');
    }
  }

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
              
                retMessage == "This user has no requests" ? (
                  <div className="col-span-3 flex items-center justify-center">
                    <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("no-results")}</h1>

                  </div>
                ) : (
                  <div className="col-span-3 flex items-center justify-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )
              
              
            )
          }
          <div className='accordion w-512 h-80' id="accordionRequests">
            {
              currentRequests.map((request) => (
                <div key={request._id} className="accordion-item bg-white border border-gray-200">
                  <h2 className="accordion-header mb-0" id="headingOne">
                    <button className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b] text-left bg-white border-0 rounded-none transition focus:outline-none;"
                    type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                    aria-controls="collapseOne">
                      <div className="flex items-center justify-between w-full">
                        <span>{t("request-for")} {t("location")} {locations[request.location_id]?.title}</span>
                        <div className="flex items-center space-x-4">
                          <Icon 
                            icon={getRequestStatusIcon(request.status)} 
                            className={`${getRequestStatusColor(request.status)} mr-1`}
                            height="20" 
                          />
                          <span className={`text-sm font-semibold ${getRequestStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          {request.status === 'Client request' && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              Pending
                            </span>
                          )}
                          {request.status.includes('rejected') && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div id={`id${request._id}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                    <div className="accordion-body py-2 px-5 text-sm flex justify-between">
        
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("address")}: {locations[request.location_id]?.location?.match(/[^,]+,[^,]+/g)?.[0] || locations[request.location_id]?.location}</h5>
                          <h5>{t("start-date")}: {request.from?.split('T')[0]} </h5>
                          <h5>{t("end-date")}: {request.to?.split('T')[0]}</h5>
                          <h5 className={getRequestStatusColor(request.status)}>
                            <strong>Status:</strong> {request.status}
                          </h5>
                      </div>
                      <div className='flex flex-col mx-4 my-auto gap-1'>
                          <h5>{t("min-rooms")}: {locations[request.location_id]?.rooms}</h5>
                          <h5>{t("adults")}: {locations[request.location_id]?.adults} </h5>
                          <h5>{t("kids")}: {locations[request.location_id]?.kids}</h5>
                          <h5>{t("request-date")}: {new Date(request.created_at || request.from).toLocaleDateString()}</h5>
                      </div>
                      
                      <div className='flex ml-4 mr-16 flex-col my-auto gap-1'>
                          <h5>{t("price-range")}: {locations[request.location_id]?.price} RON/{t("night")} </h5>
                          <h5>{t("host-email")}: {locations[request.location_id]?.host_email} </h5>
                          <h5>{t("nota")}:  {locations[request.location_id]?.grade}/10 ({locations[request.location_id]?.review_count} {t("note")})</h5>
                      </div>
                      
                      <div className='flex flex-col my-auto gap-2'>
                          {/* Info despre status */}
                          {request.status === 'Client request' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
                              <Icon icon="material-symbols:info" className="inline mr-1" height="14" />
                              Waiting for host response
                            </div>
                          )}
                          
                          {request.status === 'Request rejected by host' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs">
                              <Icon icon="material-symbols:info" className="inline mr-1" height="14" />
                              Request was declined by host
                            </div>
                          )}
                          
                          {request.status === 'Request rejected because of conflict' && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-xs">
                              <Icon icon="material-symbols:info" className="inline mr-1" height="14" />
                              Dates no longer available
                            </div>
                          )}

                          {/* Delete Button */}
                          {canDeleteRequest(request) && (
                            <button 
                              onClick={() => handleDelete(request._id)}
                              className='w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-300 flex items-center justify-center'
                              title={t("cancel-request")}
                            >
                              <Icon icon="material-symbols:delete" color="#dc2626" height="16" />
                            </button>
                          )}
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
export default UserRequests