import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { server } from '../../services/axios';
import { Icon } from '@iconify/react';
import Footer from '../Footer'

// Import tab components
import DashboardContent from './tabs/DashboardContent';
import LocationsContent from './tabs/LocationsContent';
import PermitsContent from './tabs/PermitsContent';
import BlogContent from './tabs/BlogContent';
import StatisticsContent from './tabs/StatisticsContent';

const MinisterPanel = () => {
  const {state} = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locations, setLocations] = useState([]);
  const [pendingPermits, setPendingPermits] = useState([]);
  const {t} = useTranslation();

  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Helper function to determine location status based on permits
  const getLocationStatus = (location) => {
    // Safety check pentru permits
    if (!location.permits || !Array.isArray(location.permits) || location.permits.length === 0) {
      return { status: 'no_permits', label: 'Fără permise', color: 'gray' };
    }

    try {
      const approvedPermits = location.permits.filter(p => p && p.status === 'approved');
      const rejectedPermits = location.permits.filter(p => p && p.status === 'rejected');
      const pendingPermits = location.permits.filter(p => p && p.status === 'pending');

      if (rejectedPermits.length > 0) {
        return { status: 'disabled', label: 'Inactivă', color: 'red' };
      }
      
      if (pendingPermits.length > 0) {
        return { status: 'pending', label: 'În așteptare', color: 'yellow' };
      }
      
      if (approvedPermits.length === location.permits.length && location.permits.length > 0) {
        return { status: 'active', label: 'Activă', color: 'green' };
      }

      return { status: 'pending', label: 'În așteptare', color: 'yellow' };
    } catch (error) {
      console.error('Error calculating location status:', error);
      return { status: 'no_permits', label: 'Fără permise', color: 'gray' };
    }
  };

  // Enhanced locations with computed status
  const locationsWithStatus = locations.map(location => {
    try {
      return {
        ...location,
        computedStatus: getLocationStatus(location)
      };
    } catch (error) {
      console.error('Error processing location:', error);
      return {
        ...location,
        computedStatus: { status: 'no_permits', label: 'Eroare', color: 'gray' }
      };
    }
  });

  // Update current locations to use enhanced data
  const totalLocations = locationsWithStatus.length;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentLocations = totalLocations ? locationsWithStatus.slice(startIndex, endIndex) : [];

  // Location handlers
  const handleDelete = async location => {
    try {
      await server.delete(`/location/${location._id}`);
      setReload(location._id);
    } catch (e) {
      console.log(e.message)
    }
  }

  // Permit handler
  const handlePermitReview = async (permitId, status, permitNumber, rejectionReason) => {
    try {
      const reviewData = {
        status: status,
        permit_number: permitNumber,
        rejection_reason: rejectionReason
      };

      await server.put(`/permits/${permitId}/review`, reviewData);
      
      // Refresh pending permits
      const ret = await server.get('/permits/pending');
      setPendingPermits(ret.data.permits || []);
      
      // Force reload of locations to update their status
      setReload(prev => prev + 1);
      
      alert(`Permis ${status === 'approved' ? 'aprobat' : 'respins'} cu succes!`);
    } catch (error) {
      console.error('Error reviewing permit:', error);
      alert('Eroare la procesarea permisului');
    }
  };

  // Data fetching - also fetch permits for each location
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsResponse = await server.post(`/getLocations/${state.user.email}`, {mode: "Rent"});
        const fetchedLocations = locationsResponse.data.locations;
        
        console.log('Fetched locations:', fetchedLocations);
        
        // Fetch permits for each location
        const locationsWithPermits = await Promise.all(
          fetchedLocations.map(async (location) => {
            try {
              console.log(`Fetching permits for location: ${location._id}`);
              const permitsResponse = await server.get(`/location/${location._id}/permits`);
              console.log(`Permits response for ${location._id}:`, permitsResponse.data);
              
              const locationWithPermits = {
                ...location,
                permits: permitsResponse.data.permits || []
              };
              console.log(`Final location with permits:`, locationWithPermits);
              return locationWithPermits;
            } catch (error) {
              console.log(`Error fetching permits for location ${location._id}:`, error);
              console.log('Error details:', error.response?.data);
              
              // Try alternative endpoint if this one fails
              try {
                console.log(`Trying alternative: fetch all permits and filter by location_id`);
                const allPermitsResponse = await server.get('/permits/pending');
                const allPermits = allPermitsResponse.data.permits || [];
                const locationPermits = allPermits.filter(permit => permit.location_id === location._id);
                console.log(`Found ${locationPermits.length} permits for location ${location._id} via filtering`);
                
                return {
                  ...location,
                  permits: locationPermits
                };
              } catch (altError) {
                console.log('Alternative method also failed:', altError);
                return {
                  ...location,
                  permits: []
                };
              }
            }
          })
        );
        
        console.log('Final locations with permits:', locationsWithPermits);
        setLocations(locationsWithPermits);
        
        // Fetch pending permits
        const pendingResponse = await server.get('/permits/pending');
        console.log('Pending permits:', pendingResponse.data.permits);
        setPendingPermits(pendingResponse.data.permits || []);
        
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reload, state.user.email]);

  // Tab configuration
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'material-symbols:dashboard',
      count: null
    },
    {
      id: 'locations',
      label: 'Locații',
      icon: 'material-symbols:location-on',
      count: locations.length
    },
    {
      id: 'permits',
      label: 'Permise',
      icon: 'material-symbols:pending-actions',
      count: pendingPermits.length
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: 'dashicons:welcome-write-blog',
      count: null
    },
    {
      id: 'statistics',
      label: 'Statistici',
      icon: 'material-symbols:analytics',
      count: null
    }
  ];

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
      </div>
      
      <div className='row-span-8 bg-secondary flex flex-col'>
        {/* Tab Navigation */}
        <div className='bg-white shadow-sm border-b border-gray-200 px-4 py-3'>
          <div className='flex space-x-8 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon icon={tab.icon} height="20" className='mr-2' />
                <span className='font-medium'>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-white text-primary' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='flex-1 overflow-y-auto'>
          {activeTab === 'dashboard' && (
            <DashboardContent 
              locations={locationsWithStatus}
              pendingPermits={pendingPermits}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'locations' && (
            <LocationsContent 
              currentLocations={currentLocations}
              locations={locationsWithStatus}
              handleDelete={handleDelete}
              paginate={paginate}
              currentPage={currentPage}
              perPage={perPage}
              t={t}
            />
          )}

          {activeTab === 'permits' && (
            <PermitsContent 
              pendingPermits={pendingPermits}
              handlePermitReview={handlePermitReview}
            />
          )}

          {activeTab === 'blog' && (
            <BlogContent state={state} t={t} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsContent />
          )}
        </div>
      </div>

      <div className='bottom-0'>
        <Footer />   
      </div>
    </div>
  )
}

export default MinisterPanel