import React, { useEffect, useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, getJson, setOptions, formatDate } from '@mobiscroll/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Pagination from '../Pagination';
import { useAlert } from 'react-alert';
import { server } from '../../services/axios';
import { Icon } from '@iconify/react';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const now = Date.now();

function Bookings() {
  const {state} = useLocation();
  console.log(state);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const alert = useAlert();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [retMessage, setRetMessage] = useState("");
  const [colors, setColors] = useState([]);

  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [rating, setRating] = useState(1);
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  const handleReview = async (id, conn_id) => {
    try {
      await server.put(`/addRating/${id}/${conn_id}`, {grade: rating})
      alert.success(`Rating given to user ${users[id].first_name}`)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (e) {
      console.log(e.message)
    }

  }

  const addUnavailability = async e => {
    e.preventDefault();

    try {
      if (start && end) {
        await server.put(`/addUnavailableDates/${state.location._id}`, {
          from: new Date(start.getTime() - (start.getTimezoneOffset() * 60000)),
          to: new Date(end.getTime() - (end.getTimezoneOffset() * 60000))
        })
        
        setColors([...colors, {
          start: start,
          end: end,
          background: '#ffbaba80'
        }])
      } else {
        alert.error("Please insert start date and end date");
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const paginate = pageNumber => setCurrentPage(pageNumber);

    useEffect(() => {
      

      server.get(`/getLocationBookings/${state.location._id}`).then(ret => {
        
        let tempUsers = {}
        let tempColors = colors
        setRetMessage(ret.data.message);
        
        for(let i = 0; i < ret?.data?.bookings?.length; ++i) {
          server.get(`/getUserById/${ret.data.bookings[i].user_id}`).then(ret2 => {
            
            tempUsers = {...tempUsers, [ret.data.bookings[i].user_id]: ret2.data.user}
  
            if(i == ret.data.bookings.length - 1) {
              setTimeout(() => {
                setRequests(ret.data.bookings);
              }, 500)

              setTimeout(() => {
                setUsers(tempUsers);
              }, 500)
              
              
            }
          })
        }
        
        for (let i = 0; i < state.location.unavailableDates.length; ++i) {
          tempColors = [...tempColors, {
            start: state.location.unavailableDates[i].from,
            end: state.location.unavailableDates[i].to,
            background: '#ffbaba80'
          }]

          if (i == state.location.unavailableDates.length - 1) {
            setColors(tempColors)
          }
        }
      });
        
        
    }, []);

    console.log(users)
    return (
      <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
        <div className='bg-primary flex-flex-row sticky top-0'>
          <Navbar current={t("host-functions")} state={state} className="z-20"/>
        </div>
        <div className='row-span-8 bg-secondary grid grid-cols-2'>
            <button class=" absolute mt-4 left-5 px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
              <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
              <span className='text-lg font-serif'>{t("go-back")}</span>
            </button>
          <div className=" bg-secondary h-fit w-256 mx-auto my-16 flex flex-col">
            
            <div className="mbsc-form-group-title font-semibold">{t("bookings-for")} {state.location.title}</div>
              <Datepicker display="inline" controls={['calendar']} colors={colors} pages="2"/>
            <div className='flex justify-around gap-6 mx-auto mt-3'>
              <div className='relative flex items-center'>
                <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <Datepicker value={start} onChange={e => setStart(e.value)} controls={['calendar']} touchUi={true} display='anchored' min={new Date()} inputComponent="input" inputProps={{placeholder: t("start-date"), class: 'date-range w-48 h-12 pr-1 pl-8'}}/>
              </div>
              <div className=' relative flex items-center'>
                <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                <Datepicker value={end} onChange={e => setEnd(e.value)}  controls={['calendar']} display='anchored' min={start} touchUi={true} inputComponent="input" inputProps={{placeholder: t("end-date"), class: 'date-range w-48 h-12 pr-1 pl-8'}} />
              </div>
            </div>

            <div className='flex flex-row mx-auto mb-4 gap-2'>
              <button onClick={addUnavailability} type="submit" className='uppercase inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-lg 2xl:text-xl duration-300 mt-8 text-white py-1 px-4 2xl:px-12 2xl:py-3 rounded-2xl'>{t("add-unavaiablity")}</button>
            </div>
          </div>

          <div className='my-16 mx-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
            <div className="m-auto my-2 text-white relative bottom-6 flex items-center">
              <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
              <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("Location-bookings")}</h1>
            </div>
            {
              (users.length == 0 || requests.length == 0) && (
                
                  retMessage == "This location has no bookings" ? (
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
            <div className='accordion w-300 h-80 ' id="accordionRequests">
              {
                currentRequests.map((request) => (
                  <div class="accordion-item bg-white border border-gray-200">
                    <h2 class="accordion-header mb-0" id="headingOne">
                      <button class="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b]text-left bg-white border-0 rounded-none transition focus:outline-none;"
                      type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                      aria-controls="collapseOne">
                        {t("booking-from")} {users[request.user_id]?.first_name}
                      </button>
                    </h2>
                    <div id={`id${request._id}`}class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                      <div class="accordion-body py-2 px-2 text-sm flex justify-between">
            
                        <div className='flex flex-col mr-2 my-auto gap-1'>
                            <h5>{t("full-name")}: {users[request.user_id]?.first_name} {users[request.user_id]?.last_name}</h5>
                            <h5>{t("start-date")}: {request.from?.split('T')[0]} </h5>
                            <h5>{t("end-date")}: {request.to?.split('T')[0]}</h5>
                        </div>
                        <div className='flex flex-col mx-2 my-auto gap-1'>
                            <h5>{t("nota")}:  {users[request.user_id]?.grade}/10 ({users[request.user_id]?.review_count} {t("note")})</h5>
                            <h5>Email: {users[request.user_id]?.email} </h5>
                            <h5>{t("phone")}: {users[request.user_id]?.phone}</h5>
                        </div>
                        
                        <div className='flex ml-2 flex-col my-auto gap-1'>
                            <h5>{t("personal-info")}: {users[request.user_id]?.personal_info} </h5>
                            <h5>{t("purpose")}: {users[request.user_id]?.purpose} </h5>
                            <h5>{t("interests")}:  {users[request.user_id]?.interests}</h5>
                        </div>

                        <div className='flex flex-row my-auto '>
                          {
                            new Date(request.to) <= now && (
                              request.reviewed_location ? (
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
                            !request.reviewed_location && (
                              <button className={`w-9 h-9 m-auto rounded-full bg-primary  px-1.5 ${(new Date(request.to) > now || request.reviewed_location) ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary transition-colors duration-300'}`} 
                                onClick={() => handleReview(request.user_id, request._id)}>
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
            {
              requests.length != 0 &&
              <div className=''>
                <Pagination perPage={perPage} totalPosts={requests.length} paginate={paginate} currentPage={currentPage}/>

              </div>


            }   
          </div>
        </div>
          
        <div className='bottom-0'>
          <Footer />   
        </div>
        
      </div>
    )
      
        
}

export default Bookings;