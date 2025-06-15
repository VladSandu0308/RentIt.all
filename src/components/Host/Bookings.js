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
import SimpleInvoiceGenerationModal from '../invoicing/SimpleInvoiceGenerationModal';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const now = Date.now();

function Bookings() {
  const {state} = useLocation();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const alert = useAlert();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [retMessage, setRetMessage] = useState("");
  const [colors, setColors] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [invoiceRequests, setInvoiceRequests] = useState([]);

  const [perPage, setPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [rating, setRating] = useState(1);
  
  let currentRequests = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentRequests = requests?.slice(firstIndex, lastIndex);

  // Calculate quick stats including invoice data
  const calculateStats = () => {
    const confirmedBookings = requests.filter(r => 
      r.status === 'Payment completed - Booking confirmed' || 
      (r.completed && r.status?.includes('Payment completed'))
    );
    
    const pendingPayments = requests.filter(r => 
      r.status === 'Request accepted by host - Awaiting payment' ||
      r.status === 'Accepted - Payment in progress'
    );
    
    const pendingInvoices = requests.filter(r => 
      r.invoice_status === 'requested' || r.invoice_status === 'processing'
    ).length;
    
    const totalRevenue = confirmedBookings.reduce((sum, r) => sum + (r.total_amount || 0), 0);
    
    const occupancyDays = confirmedBookings.reduce((sum, r) => {
      const days = Math.ceil((new Date(r.to) - new Date(r.from)) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    
    return { 
      totalRevenue, 
      totalBookings: confirmedBookings.length, 
      occupancyDays,
      pendingPayments: pendingPayments.length,
      pendingInvoices
    };
  };

  // Generate calendar colors with booking status
  const generateCalendarColors = () => {
    let tempColors = [];
    
    requests.forEach(request => {
      let backgroundColor = '#94a3b880'; // default gray
      
      if (request.status === 'Payment completed - Booking confirmed' || 
          (request.completed && request.status?.includes('Payment completed'))) {
        backgroundColor = '#22c55e80'; // green - confirmed
      } else if (request.status === 'Request accepted by host - Awaiting payment') {
        backgroundColor = '#f59e0b80'; // amber - awaiting payment
      } else if (request.status === 'Accepted - Payment in progress') {
        backgroundColor = '#3b82f680'; // blue - payment in progress
      } else if (request.status?.includes('Payment failed')) {
        backgroundColor = '#ef444480'; // red - failed
      }
      
      if (request.from && request.to) {
        tempColors.push({
          start: new Date(request.from),
          end: new Date(request.to),
          background: backgroundColor
        });
      }
    });
    
    // Add manual unavailable dates
    if (state.location.unavailableDates) {
      for (let i = 0; i < state.location.unavailableDates.length; ++i) {
        tempColors.push({
          start: new Date(state.location.unavailableDates[i].from),
          end: new Date(state.location.unavailableDates[i].to),
          background: '#dc262680' // red - unavailable
        });
      }
    }
    
    return tempColors;
  };

  const getBookingStatusColor = (status) => {
    if (status === 'Payment completed - Booking confirmed') return 'text-green-600';
    if (status === 'Request accepted by host - Awaiting payment') return 'text-amber-600';
    if (status === 'Accepted - Payment in progress') return 'text-blue-600';
    if (status?.includes('Payment failed')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBookingStatusBadge = (status) => {
    if (status === 'Payment completed - Booking confirmed') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Confirmed</span>;
    }
    if (status === 'Request accepted by host - Awaiting payment') {
      return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Awaiting Payment</span>;
    }
    if (status === 'Accepted - Payment in progress') {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Processing</span>;
    }
    if (status?.includes('Payment failed')) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Failed</span>;
    }
    return null;
  };

  const getInvoiceStatusBadge = (invoiceStatus) => {
    if (invoiceStatus === 'requested') {
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Invoice Requested</span>;
    }
    if (invoiceStatus === 'processing') {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Processing Invoice</span>;
    }
    if (invoiceStatus === 'generated') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">Invoice Ready</span>;
    }
    return null;
  };

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

  const handleGenerateInvoice = (request) => {
    setSelectedBookingForInvoice(request);
    setShowInvoiceModal(true);
  };

  const handleInvoiceGenerated = async (invoiceData) => {
    try {
      await server.post(`/generateInvoice/${selectedBookingForInvoice._id}`, {
        ...invoiceData,
        booking_id: selectedBookingForInvoice._id,
        user_id: selectedBookingForInvoice.user_id,
        location_id: state.location._id,
        host_id: state.user._id
      });
      
      alert.success('Factură generată cu succes!');
      setShowInvoiceModal(false);
      setSelectedBookingForInvoice(null);
      
      // Refresh to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      alert.error('Eroare la generarea facturii');
      console.log(e.message);
    }
  };

  const downloadGeneratedInvoice = async (bookingId) => {
    try {
      const response = await server.get(`/downloadInvoice/${bookingId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert.error('Eroare la descărcarea facturii');
      console.log(e.message);
    }
  };

  const markInvoiceAsProcessing = async (bookingId) => {
    try {
      await server.put(`/updateInvoiceStatus/${bookingId}`, {
        status: 'processing'
      });
      alert.success('Status factură actualizat');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      alert.error('Eroare la actualizarea statusului');
      console.log(e.message);
    }
  };

  const addUnavailability = async e => {
    e.preventDefault();

    try {
      if (start && end) {
        await server.put(`/addUnavailableDates/${state.location._id}`, {
          from: new Date(start.getTime() - (start.getTimezoneOffset() * 60000)),
          to: new Date(end.getTime() - (end.getTimezoneOffset() * 60000))
        })
        
        alert.success("Unavailable dates added successfully!");
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } else {
        alert.error("Please insert start date and end date");
      }
    } catch (e) {
      console.log(e.message)
      alert.error("Failed to add unavailable dates");
    }
  }

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/getLocationBookings/${state.location._id}`).then(ret => {
      let tempUsers = {}
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
    });

    // Fetch invoice requests for this location
    server.get(`/getInvoiceRequests/${state.location._id}`).then(ret => {
      setInvoiceRequests(ret.data.requests || []);
    }).catch(e => {
      console.log('No invoice requests found');
    });
  }, []);

  // Update calendar colors when requests change
  useEffect(() => {
    if (requests.length > 0 || state.location.unavailableDates?.length > 0) {
      const newColors = generateCalendarColors();
      setColors(newColors);
    }
  }, [requests, state.location.unavailableDates]);

  const stats = calculateStats();

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary grid grid-cols-2'>
        <button className="absolute mt-4 left-5 px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
          <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
          <span className='text-lg font-serif'>{t("go-back")}</span>
        </button>
       
        {/* Left Column - Scrollable Calendar */}
        <div className="bg-secondary mt-4 h-164 overflow-y-auto">
          <div className="w-256 mx-auto pt-16 pb-8 px-4">
            {/* Enhanced Stats with Invoice Info */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                <Icon icon="material-symbols:analytics" className="mr-2" height="18" color="#233c3b" />
                Stats - {state.location.title}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-green-50 p-2 rounded">
                  <div className="text-lg font-bold text-green-600">{stats.totalRevenue} RON</div>
                  <div className="text-xs text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center bg-blue-50 p-2 rounded">
                  <div className="text-lg font-bold text-blue-600">{stats.totalBookings}</div>
                  <div className="text-xs text-gray-600">Confirmed</div>
                </div>
                <div className="text-center bg-purple-50 p-2 rounded">
                  <div className="text-lg font-bold text-purple-600">{stats.occupancyDays}</div>
                  <div className="text-xs text-gray-600">Booked Nights</div>
                </div>
                <div className="text-center bg-amber-50 p-2 rounded">
                  <div className="text-lg font-bold text-amber-600">{stats.pendingPayments}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
              
              {/* Invoice Stats */}
              {stats.pendingInvoices > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:receipt-long" className="mr-2" height="16" color="#f59e0b" />
                      <span className="text-sm text-gray-700">Facturi solicitate:</span>
                    </div>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {stats.pendingInvoices}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Legend - Enhanced */}
            <div className="bg-white rounded-lg shadow p-3 mb-3">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm">Calendar Legend</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-400 rounded mr-1"></div>
                  <span>Awaiting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
                  <span>Processing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>
            
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
              <button onClick={addUnavailability} type="submit" className='uppercase inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-lg 2xl:text-xl duration-300 mt-8 text-white py-1 px-4 2xl:px-12 2xl:py-3 rounded-2xl'>{t("add-unavaiablity")}</button>
            </div>
          </div>
        </div>

        {/* Right Column - Bookings List */}
        <div className='my-2 mx-auto bg-primary pt-12 p-6 pb-4 flex flex-col'>
          <div className="m-auto my-2 text-white relative bottom-6 flex items-center">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("Location-bookings")}</h1>
          </div>
          
          {
            (users.length == 0 || requests.length == 0) && (
              retMessage == "This location has no bookings" ? (
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
          
          <div className='accordion w-300' id="accordionRequests">
            {
              currentRequests.map((request) => (
                <div key={request._id} className="accordion-item bg-white border border-gray-200">
                  <h2 className="accordion-header mb-0" id="headingOne">
                    <button className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b] text-left bg-white border-0 rounded-none transition focus:outline-none;"
                    type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                    aria-controls="collapseOne">
                      <div className="flex items-center justify-between w-full">
                        <span>{t("booking-from")} {users[request.user_id]?.first_name}</span>
                        <div className="flex items-center">
                          {getBookingStatusBadge(request.status)}
                          {getInvoiceStatusBadge(request.invoice_status)}
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div id={`id${request._id}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                    <div className="accordion-body py-2 px-2 text-sm">
                      <div className="flex justify-between">
                        <div className='flex flex-col mr-2 my-auto gap-1'>
                            <h5>{t("full-name")}: {users[request.user_id]?.first_name} {users[request.user_id]?.last_name}</h5>
                            <h5>{t("start-date")}: {request.from?.split('T')[0]} </h5>
                            <h5>{t("end-date")}: {request.to?.split('T')[0]}</h5>
                            {request.status && (
                              <h5 className={getBookingStatusColor(request.status)}>
                                <strong>Status:</strong> {request.status}
                              </h5>
                            )}
                        </div>
                        <div className='flex flex-col mx-2 my-auto gap-1'>
                            <h5>{t("nota")}:  {users[request.user_id]?.grade}/10 ({users[request.user_id]?.review_count} {t("note")})</h5>
                            <h5>Email: {users[request.user_id]?.email} </h5>
                            <h5>{t("phone")}: {users[request.user_id]?.phone}</h5>
                            {request.total_amount && (
                              <h5><strong>Total:</strong> {request.total_amount} RON</h5>
                            )}
                        </div>
                        
                        <div className='flex ml-2 flex-col my-auto gap-1'>
                            <h5>{t("personal-info")}: {users[request.user_id]?.personal_info} </h5>
                            <h5>{t("purpose")}: {users[request.user_id]?.purpose} </h5>
                            <h5>{t("interests")}:  {users[request.user_id]?.interests}</h5>
                        </div>

                        <div className='flex flex-col my-auto gap-2'>
                          {/* Review Section */}
                          {
                            new Date(request.to) <= now && (
                              request.reviewed_location ? (
                                <p className='text-sm flex items-center mr-1 text-green-600'>
                                  <Icon icon="material-symbols:check-circle" className="mr-1" height="16" />
                                  {t("reviewed")}
                                </p> 
                              ) : (
                                <div className='flex items-center gap-2'>
                                  <div className='relative flex items-center'>
                                    <Icon icon="akar-icons:star" color="#233c3b" height="16" className='absolute ml-1 select-none'/>
                                    <input onChange={e => setRating(e.target.value)} type="number" min="1" max="10" className='rating-range w-14 pl-5' placeholder="Rate"/>
                                  </div>
                                  <button 
                                    className={`w-8 h-8 rounded-full bg-primary px-1.5 ${(new Date(request.to) > now || request.reviewed_location) ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary transition-colors duration-300'}`} 
                                    onClick={() => handleReview(request.user_id, request._id)}
                                    disabled={new Date(request.to) > now || request.reviewed_location}
                                  >
                                    <Icon icon="ic:baseline-grade" color="#233c3b" height="16"/>
                                  </button>
                                </div>
                              )
                            )
                          }
                        </div>
                      </div>

                      {/* Invoice Management Section */}
                      {(request.status === 'Payment completed - Booking confirmed' || 
                        (request.completed && request.status?.includes('Payment completed'))) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <h6 className="font-semibold text-gray-700 flex items-center">
                              <Icon icon="material-symbols:receipt-long" className="mr-2" height="18" />
                              Documente & Facturare:
                            </h6>
                            
                            <div className="flex items-center space-x-2">
                              {request.invoice_status === 'requested' && (
                                <>
                                  <button
                                    onClick={() => handleGenerateInvoice(request)}
                                    className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs transition-colors duration-300"
                                  >
                                    <Icon icon="material-symbols:receipt-long-add" className="mr-1" height="14" />
                                    Generează factură
                                  </button>
                                  <button
                                    onClick={() => markInvoiceAsProcessing(request._id)}
                                    className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs transition-colors duration-300"
                                  >
                                    <Icon icon="material-symbols:sync" className="mr-1" height="14" />
                                    Procesez manual
                                  </button>
                                </>
                              )}
                              
                              {request.invoice_status === 'processing' && (
                                <button
                                  onClick={() => handleGenerateInvoice(request)}
                                  className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs transition-colors duration-300"
                                >
                                  <Icon icon="material-symbols:upload" className="mr-1" height="14" />
                                  Încarcă factură
                                </button>
                              )}
                              
                              {request.invoice_status === 'generated' && (
                                <button
                                  onClick={() => downloadGeneratedInvoice(request._id)}
                                  className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs transition-colors duration-300"
                                >
                                  <Icon icon="material-symbols:download" className="mr-1" height="14" />
                                  Descarcă factură
                                </button>
                              )}
                              
                              {!request.invoice_status && (
                                <span className="text-xs text-gray-500 italic">
                                  Nicio solicitare de factură
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Invoice Request Details */}
                          {request.invoice_details && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <strong>Detalii solicitare:</strong>
                              <div>Nume firmă: {request.invoice_details.company_name}</div>
                              <div>CUI: {request.invoice_details.cui}</div>
                              <div>Adresă: {request.invoice_details.address}</div>
                            </div>
                          )}
                        </div>
                      )}
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

      {/* Simple Invoice Generation Modal */}
      {showInvoiceModal && selectedBookingForInvoice && (
        <SimpleInvoiceGenerationModal
          booking={selectedBookingForInvoice}
          user={users[selectedBookingForInvoice.user_id]}
          location={state.location}
          onClose={() => setShowInvoiceModal(false)}
          onGenerate={handleInvoiceGenerated}
        />
      )}
        
      <div className='bottom-0'>
        <Footer />   
      </div>
    </div>
  )
}

export default Bookings;