import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { server } from '../../services/axios';
import { Icon } from '@iconify/react';
import Footer from '../Footer'
import Navbar from '../Navbar'
import Pagination from '../Pagination';
import OwnListing from './OwnListing';

const HostMain = () => {
  const {state} = useLocation();
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);

  const totalLocations = locations.length;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentLocations = totalLocations ? locations.slice(startIndex, endIndex) : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchLocationsWithPermits = async () => {
      try {
        // Fetch own locations
        const locationsResponse = await server.get(`/getOwnLocations/${state.user.email}`);
        const fetchedLocations = locationsResponse.data.locations;
        
        // Fetch permits for each location
        const locationsWithPermits = await Promise.all(
          fetchedLocations.map(async (location) => {
            try {
              const permitsResponse = await server.get(`/location/${location._id}/permits`);
              return {
                ...location,
                permits: permitsResponse.data.permits || []
              };
            } catch (error) {
              console.log(`Error fetching permits for location ${location._id}:`, error);
              return {
                ...location,
                permits: []
              };
            }
          })
        );
        
        setLocations(locationsWithPermits);
      } catch (error) {
        console.log('Error fetching locations:', error);
      }
    };

    fetchLocationsWithPermits();
  }, [reload, state.user.email]);

  return (
    <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("host-functions")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary flex flex-col'>
        <button onClick={() => navigate("/host/add/mode", {state})} className="w-68 mx-auto mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center">
          <Icon icon="bi:house-door-fill" color="#233c3b" height="20" className='mr-2 mb-0.5'/>
          <p className='text-textMain text-xl font-semibold uppercase'>{t("add-new-location")}</p>
        </button>

        {/* Summary Cards */}
        <div className='mx-auto mt-4 mb-2'>
          <div className='flex gap-4 text-sm'>
            <div className='bg-white rounded-lg px-4 py-2 shadow-sm'>
              <span className='text-gray-600'>Total locații: </span>
              <span className='font-semibold text-gray-800'>{locations.length}</span>
            </div>
            <div className='bg-green-50 rounded-lg px-4 py-2 shadow-sm'>
              <span className='text-green-600'>Active: </span>
              <span className='font-semibold text-green-800'>
                {locations.filter(loc => {
                  const approvedPermits = loc.permits?.filter(p => p.status === 'approved') || [];
                  const totalPermits = loc.permits?.length || 0;
                  return totalPermits > 0 && approvedPermits.length === totalPermits;
                }).length}
              </span>
            </div>
            <div className='bg-yellow-50 rounded-lg px-4 py-2 shadow-sm'>
              <span className='text-yellow-600'>În așteptare: </span>
              <span className='font-semibold text-yellow-800'>
                {locations.filter(loc => loc.permits?.some(p => p.status === 'pending')).length}
              </span>
            </div>
            <div className='bg-red-50 rounded-lg px-4 py-2 shadow-sm'>
              <span className='text-red-600'>Respinse: </span>
              <span className='font-semibold text-red-800'>
                {locations.filter(loc => loc.permits?.some(p => p.status === 'rejected')).length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-around mt-4">
          {currentLocations.length === 0 ? (
            <div className='text-center py-12'>
              <Icon icon="material-symbols:home" height="64" className='text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Nu aveți încă locații</h3>
              <p className='text-gray-600 mb-4'>Începeți prin a adăuga prima dvs. proprietate</p>
              <button 
                onClick={() => navigate("/host/add/mode", {state})} 
                className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg flex items-center mx-auto"
              >
                <Icon icon="bi:house-door-fill" height="20" className='mr-2'/>
                {t("add-new-location")}
              </button>
            </div>
          ) : (
            currentLocations.map((location) => (
              <OwnListing 
                key={location._id} 
                state={state} 
                location={location} 
                setReload={setReload} 
              />
            ))
          )}
        </div>

        {locations.length > perPage && (
          <div className='bg-secondary mx-auto absolute inset-x-0 bottom-16'>
            <Pagination perPage={perPage} totalPosts={locations.length} paginate={paginate} currentPage={currentPage}/>
          </div>
        )}
      </div>
        
      <div className='bottom-0'>
        <Footer />   
      </div>
    </div>
  )
}

export default HostMain