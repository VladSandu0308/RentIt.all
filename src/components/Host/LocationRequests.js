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
  const [selectedRequests, setSelectedRequests] = useState([]);

  const [perPage, setPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [retMessage, setRetMessage] = useState("");
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate request stats
  const calculateRequestStats = () => {
    const pendingRequests = requests.filter(r => r.status === 'Client request');
    const today = new Date().toDateString();
    const todayRequests = requests.filter(r => 
      new Date(r.created_at || r.from).toDateString() === today
    );
    
    const highRatingUsers = requests.filter(r => 
      users[r.user_id] && users[r.user_id].grade >= 8
    );
    
    return {
      totalRequests: requests.length,
      pendingRequests: pendingRequests.length,
      todayRequests: todayRequests.length,
      highRatingRequests: highRatingUsers.length
    };
  };

  // Filter and sort requests
  const getFilteredAndSortedRequests = () => {
    let filteredRequests = requests.filter(request => {
      // Search filter
      const user = users[request.user_id];
      const matchesSearch = !searchTerm || 
        (user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Rating filter
      let matchesRating = true;
      if (filterRating !== 'all' && user) {
        if (filterRating === 'high') matchesRating = user.grade >= 8;
        else if (filterRating === 'medium') matchesRating = user.grade >= 5 && user.grade < 8;
        else if (filterRating === 'low') matchesRating = user.grade < 5;
      }
      
      return matchesSearch && matchesRating;
    });

    // Sort requests
    filteredRequests.sort((a, b) => {
      const userA = users[a.user_id];
      const userB = users[b.user_id];
      
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.from) - new Date(a.created_at || a.from);
        case 'oldest':
          return new Date(a.created_at || a.from) - new Date(b.created_at || b.from);
        case 'rating':
          return (userB?.grade || 0) - (userA?.grade || 0);
        case 'name':
          return (userA?.first_name || '').localeCompare(userB?.first_name || '');
        default:
          return 0;
      }
    });

    return filteredRequests;
  };

  const filteredRequests = getFilteredAndSortedRequests();
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  const currentRequests = filteredRequests?.slice(firstIndex, lastIndex);

  const getRatingColor = (grade) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    if (grade >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingBadge = (grade) => {
    if (grade >= 8) return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Excellent</span>;
    if (grade >= 6) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Good</span>;
    if (grade >= 4) return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">Fair</span>;
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Poor</span>;
  };

  const getRequestStatusBadge = (request) => {
    if (request.status === 'Client request') {
      const isToday = new Date(request.created_at || request.from).toDateString() === new Date().toDateString();
      return isToday ? 
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">🆕 New Today</span> :
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>;
    }
    return null;
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    server.get(`/getLocationRequests/${state.location._id}`).then(ret => {
      let tempUsers = {}
      console.log(ret)
      setRetMessage(ret.data.message);
      
      for(let i = 0; i < ret?.data?.requests?.length; ++i) {
        server.get(`/getUserById/${ret.data.requests[i].user_id}`).then(ret2 => {
          console.log(ret2)
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
      alert.success(`Successfully accepted request for user ${name} starting from ${from} to ${to}`);
      navigate('/host', {state});
    } catch (e) {
      console.log(e.message)
      alert.error('Failed to accept request');
    }
  }

  const handleReject = async (id, name, from, to) => {
    try {
      await server.put(`/rejectConnection/${id}`);
      window.location.reload()
      alert.success(`Successfully rejected request for user ${name} starting from ${from} to ${to}`);
    } catch (e) {
      console.log(e.message)
      alert.error('Failed to reject request');
    }
  }

  // Bulk actions
  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === currentRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(currentRequests.map(r => r._id));
    }
  };

  const handleBulkAccept = async () => {
    if (selectedRequests.length === 0) return;
    
    try {
      for (const requestId of selectedRequests) {
        const request = requests.find(r => r._id === requestId);
        const user = users[request.user_id];
        await server.put(`/acceptConnection/${requestId}`, {
          email: user.email, 
          location_title: state.location.title
        });
      }
      alert.success(`Successfully accepted ${selectedRequests.length} requests`);
      setSelectedRequests([]);
      navigate('/host', {state});
    } catch (e) {
      alert.error('Failed to process bulk accept');
    }
  };

  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) return;
    
    try {
      for (const requestId of selectedRequests) {
        await server.put(`/rejectConnection/${requestId}`);
      }
      alert.success(`Successfully rejected ${selectedRequests.length} requests`);
      setSelectedRequests([]);
      window.location.reload();
    } catch (e) {
      alert.error('Failed to process bulk reject');
    }
  };

  const stats = calculateRequestStats();

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex'>
        <button className="absolute mt-4 left-5 px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2 z-10" onClick={() => navigate(-1, {state})}>
          <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
          <span className='text-lg font-serif'>{t("go-back")}</span>
        </button>
        
        <div className='mt-4 mx-auto h-full bg-primary pt-12 p-6 pb-4 flex flex-col max-w-6xl w-full'>
          <div className="m-auto text-white relative bottom-6 flex items-center mb-4">
            <Icon icon="cil:search" color="#233c3b" rotate={1} className="mr-2" height="30"/>
            <h1 className='text-[#233c3b] text-4xl font-ultra font-bold '>{t("Location-requests")}</h1>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Icon icon="material-symbols:analytics" className="mr-2" height="20" color="#233c3b" />
              Request Statistics - {state.location.title}
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalRequests}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div className="text-center bg-amber-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{stats.pendingRequests}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.todayRequests}</div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
              <div className="text-center bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.highRatingRequests}</div>
                <div className="text-sm text-gray-600">High Rating (8+)</div>
              </div>
            </div>
          </div>

          {/* Filters and Bulk Actions */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border rounded-lg flex-1 max-w-xs"
                />
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                  <option value="name">Name A-Z</option>
                </select>
                
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Ratings</option>
                  <option value="high">High (8+)</option>
                  <option value="medium">Medium (5-7)</option>
                  <option value="low">Low (&lt;5)</option>
                </select>
              </div>
              
              {selectedRequests.length > 0 && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-600">{selectedRequests.length} selected</span>
                  <button
                    onClick={handleBulkAccept}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    <Icon icon="dashicons:yes" className="mr-1" height="14" />
                    Accept All
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    <Icon icon="dashicons:no" className="mr-1" height="14" />
                    Reject All
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredRequests.length == 0 && (
            retMessage == "This location has no requests" || searchTerm ? (
              <div className="col-span-3 flex items-center justify-center">
                <h1 className='text-[#3ea1a9] text-2xl font-ultra font-bold '>
                  {searchTerm ? 'No matching requests found' : t("no-results")}
                </h1>
              </div>
            ) : (
              <div className="col-span-3 flex items-center justify-center">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )
          )}

          <div className='accordion w-full h-80' id="accordionRequests">
            {currentRequests.map((request) => (
              <div key={request._id} className="accordion-item bg-white border border-gray-200 mb-2 rounded-lg shadow-sm">
                <h2 className="accordion-header mb-0" id="headingOne">
                  <button className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-[#233c3b] text-left bg-white border-0 rounded-lg transition focus:outline-none;"
                  type="button" data-bs-toggle="collapse" data-bs-target={`#id${request._id}`} aria-expanded="false"
                  aria-controls="collapseOne">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRequests.includes(request._id)}
                          onChange={() => handleSelectRequest(request._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-3"
                        />
                        <span>Request from {users[request.user_id]?.first_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {users[request.user_id] && getRatingBadge(users[request.user_id].grade)}
                        {getRequestStatusBadge(request)}
                      </div>
                    </div>
                  </button>
                </h2>
                <div id={`id${request._id}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionRequests">
                  <div className="accordion-body py-3 px-5 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className='flex flex-col gap-1'>
                        <h5><strong>{t("full-name")}:</strong> {users[request.user_id]?.first_name} {users[request.user_id]?.last_name}</h5>
                        {state.location.mode == "Rent" && (
                          <>
                            <h5><strong>{t("start-date")}:</strong> {request.from?.split('T')[0]}</h5>
                            <h5><strong>{t("end-date")}:</strong> {request.to?.split('T')[0]}</h5>
                          </>
                        )}
                        <h5><strong>Request Date:</strong> {new Date(request.created_at || request.from).toLocaleDateString()}</h5>
                      </div>
                      
                      <div className='flex flex-col gap-1'>
                        <h5 className={getRatingColor(users[request.user_id]?.grade)}>
                          <strong>{t("nota")}:</strong> {users[request.user_id]?.grade}/10 ({users[request.user_id]?.review_count} {t("note")})
                        </h5>
                        <h5><strong>Email:</strong> {users[request.user_id]?.email}</h5>
                        <h5><strong>{t("phone")}:</strong> {users[request.user_id]?.phone}</h5>
                      </div>
                      
                      <div className='flex flex-col gap-1'>
                        <h5><strong>{t("personal-info")}:</strong> {users[request.user_id]?.personal_info}</h5>
                        <h5><strong>{t("purpose")}:</strong> {users[request.user_id]?.purpose}</h5>
                        <h5><strong>{t("interests")}:</strong> {users[request.user_id]?.interests}</h5>
                      </div>

                      <div className='flex flex-col gap-2 items-center'>
                        <div className="flex gap-2">
                          <button 
                            className='w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 flex items-center justify-center' 
                            onClick={() => handleAccept(request._id, users[request.user_id]?.email, users[request.user_id]?.first_name, request.from?.split('T')[0], request.to?.split('T')[0])}
                            title="Accept Request"
                          >
                            <Icon icon="dashicons:yes" height="20" />
                          </button>

                          <button 
                            className='w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 flex items-center justify-center' 
                            onClick={() => handleReject(request._id, users[request.user_id]?.first_name, request.from?.split('T')[0], request.to?.split('T')[0])}
                            title="Reject Request"
                          >
                            <Icon icon="dashicons:no" height="20" />
                          </button>
                        </div>
                        
                        <div className="text-center">
                          {users[request.user_id] && getRatingBadge(users[request.user_id].grade)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentRequests.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRequests.length === currentRequests.length && currentRequests.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All ({currentRequests.length})</span>
              </div>
              <Pagination perPage={perPage} totalPosts={filteredRequests.length} paginate={paginate} currentPage={currentPage}/>
            </div>
          )}
        </div>
      </div>
        
      <div className='bg-secondary'>
        
      </div>
    </div>
  )
}

export default LocationRequests