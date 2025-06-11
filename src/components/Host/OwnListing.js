import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import CustomMap from '../CustomMap';
import Carousel from '../Carousel';
import { server } from '../../services/axios';

const OwnListing = ({state, location, setReload}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [permits, setPermits] = useState([]);
  const [showPermits, setShowPermits] = useState(false);

  const updatedState = {...state, id: location._id};

  // Fetch permits for this location
  useEffect(() => {
    const fetchPermits = async () => {
      try {
        const response = await server.get(`/location/${location._id}/permits`);
        setPermits(response.data.permits || []);
      } catch (error) {
        console.log('Error fetching permits:', error);
        setPermits([]);
      }
    };

    fetchPermits();
  }, [location._id]);

  const handleDelete = async e => {
    e.preventDefault();

    try {
      await server.delete(`/location/${location._id}`);
      setReload(location._id);
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleUpdatePermits = () => {
    // Navigate to AddCerere with the existing location data
    const stateForPermits = {
      ...state,
      body: {
        ...location,
        // Add any additional fields needed for permit update
        mode: location.mode,
        location: location.location,
        title: location.title
      },
      isUpdatingPermits: true // Flag to indicate this is a permit update
    };
    
    navigate("/host/add/cerere", { state: stateForPermits });
  };

  // Calculate location status based on permits
  const getLocationStatus = () => {
    if (!permits || permits.length === 0) {
      return { status: 'no_permits', label: 'Fără permise', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }

    const approvedPermits = permits.filter(p => p.status === 'approved');
    const rejectedPermits = permits.filter(p => p.status === 'rejected');
    const pendingPermits = permits.filter(p => p.status === 'pending');

    if (rejectedPermits.length > 0) {
      return { status: 'disabled', label: 'Respins', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    }
    
    if (pendingPermits.length > 0) {
      return { status: 'pending', label: 'În așteptare', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    }
    
    if (approvedPermits.length === permits.length && permits.length > 0) {
      return { status: 'active', label: 'Aprobat', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    }

    return { status: 'pending', label: 'În așteptare', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
  };

  const locationStatus = getLocationStatus();
  const hasRejectedPermits = permits.some(p => p.status === 'rejected');
  const hasPendingPermits = permits.some(p => p.status === 'pending');
  const hasAnyPermits = permits.length > 0;

  console.log('Location permits:', permits);
  console.log('Has rejected permits:', hasRejectedPermits);
  console.log('Has pending permits:', hasPendingPermits);
  console.log('Has any permits:', hasAnyPermits);

  const getPermitTypeLabel = (type) => {
    const labels = {
      businessLicense: 'Licență afaceri',
      shortTermRental: 'Închiriere scurtă',
      mountainTourism: 'Turism montan',
      ecotourism: 'Ecoturism',
      culturalHeritage: 'Patrimoniu cultural',
      ruralTourism: 'Turism rural'
    };
    return labels[type] || type;
  };

  const getPermitStatusIcon = (status) => {
    switch(status) {
      case 'approved': return 'material-symbols:check-circle';
      case 'rejected': return 'material-symbols:cancel';
      case 'pending': return 'material-symbols:pending';
      default: return 'material-symbols:help';
    }
  };

  const getPermitStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className='rounded-lg shadow-lg bg-white w-96 flex flex-col overflow-y-auto scrollbar-hide h-128 2xl:h-256 p-1'>
      <Carousel location={location} />

      <div className='pt-6 pb-4 flex justify-between relative'>
        <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
        <div className='mr-4 flex flex-col items-end space-y-2'>
          <h1 className='text-xl font-bold first-letter:uppercase'>{t("nota")} : {location.grade}/10</h1>
          {/* Location Status Badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${locationStatus.bgColor} ${locationStatus.textColor}`}>
            <Icon icon={getPermitStatusIcon(locationStatus.status)} height="12" className="mr-1" />
            {locationStatus.label}
          </span>
        </div>
        <button onClick={() => navigate("/host/add/title", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      {/* Permits Section - Always show if there are permits OR if there are rejected permits */}
      {(hasAnyPermits || hasRejectedPermits) && (
        <div className='mx-4 mb-4'>
          <button
            onClick={() => setShowPermits(!showPermits)}
            className='flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <span className='text-sm font-medium text-gray-700'>
              Permise ({permits.length})
              {hasRejectedPermits && (
                <span className='ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs'>
                  Respinse
                </span>
              )}
              {hasPendingPermits && !hasRejectedPermits && (
                <span className='ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs'>
                  În așteptare
                </span>
              )}
              {!hasRejectedPermits && !hasPendingPermits && permits.length === 0 && (
                <span className='ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs'>
                  Lipsă
                </span>
              )}
            </span>
            <Icon 
              icon={showPermits ? "material-symbols:expand-less" : "material-symbols:expand-more"} 
              height="20" 
              className='text-gray-500' 
            />
          </button>
          
          {showPermits && (
            <div className='mt-2 space-y-2 max-h-32 overflow-y-auto'>
              {permits.length > 0 ? (
                permits.map((permit) => (
                  <div key={permit._id} className='flex items-center justify-between p-2 bg-white border rounded text-xs'>
                    <span className='font-medium'>{getPermitTypeLabel(permit.permit_type)}</span>
                    <div className='flex items-center'>
                      <Icon 
                        icon={getPermitStatusIcon(permit.status)} 
                        height="14" 
                        className={`mr-1 ${getPermitStatusColor(permit.status)}`} 
                      />
                      <span className={`capitalize ${getPermitStatusColor(permit.status)}`}>
                        {permit.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800'>
                  Nu sunt permise asociate acestei locații
                </div>
              )}
              
              {/* Always show update button if there are rejected/pending permits OR no permits */}
              {(hasRejectedPermits || hasPendingPermits || permits.length === 0) && (
                <button
                  onClick={handleUpdatePermits}
                  className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center transition-colors'
                >
                  <Icon icon="material-symbols:upload" height="16" className='mr-1' />
                  {permits.length === 0 ? 'Adaugă permise' : 
                   hasRejectedPermits ? 'Actualizează permise respinse' : 
                   'Actualizează permise'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

      <div className='pt-6 pb-10 flex justify-between relative'>
        <h1 className='mx-4 text-lg font-semibold first-letter:uppercase'>{t(location?.mode?.toLowerCase())} {t("for")}  {location.price} RON</h1>
        <div className='flex flex-row mr-2'>
          <h1 className='mr-2 text-lg font-semibold first-letter:uppercase'> {state.user.first_name}</h1>
          <img className="w-7 h-7 rounded-full mr-1.5" src={state.user.profile} alt="dummy-image"></img>
        </div>
        <button onClick={() => navigate("/host/add/price", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

      <div className='pt-6 pb-10 flex justify-between relative'>
        <h1 className='ml-4 text-md first-letter:uppercase'>{location.description}</h1>
        <button onClick={() => navigate("/host/add/description", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

      <div className='relative pt-6 pb-10'>
        <h1 className='mx-4 text-md font-semibold first-letter:uppercase'>{t("address")} </h1>
        <h1 className='mt-2 mb-4 mx-4 text-md first-letter:uppercase'>{location.location}</h1>
        <div className='mx-auto w-80 h-24 z-50'>
          <CustomMap coords={location.coords}/>
        </div>
        <button onClick={() => navigate("/host/add/location", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
      
      <div className='pt-6 pb-10 flex justify-between relative'>
        <div className='grid grid-rows-3 gap-1'>
          <h1 className='ml-4 text-md first-letter:uppercase'>{location.rooms} {t("min-rooms")}  </h1>
          <h1 className='ml-4 text-md first-letter:uppercase'>{location.baths} {t("min-baths")}  </h1>
          <h1 className='ml-4 text-md first-letter:uppercase'>{location.size} m<sup>2</sup> </h1>
        </div>
        <div className='mr-7 grid grid-rows-3 gap-1'>
          <h1 className='ml-2 text-md first-letter:uppercase'>{location.adults} {t("adults")}  </h1>
          <h1 className='ml-2 text-md first-letter:uppercase'>{location.kids} {t("kids")}  </h1>
          <h1 className='text-md first-letter:uppercase flex items-end'>
            <Icon icon={`dashicons:${location.furnished}`} color="black" height="24" /> {t("furnished")} 
          </h1>
        </div>
        <button onClick={() => navigate("/host/add/guests", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />
      
      <div className='flex flex-col py-6 pb-10 relative'>
        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.AC ? 'yes': 'no'}`} color="black" height="18" /> AC
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.heat ? 'yes': 'no'}`} color="black" height="18" /> {t("heat")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='mx-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.wifi ? 'yes': 'no'}`} color="black" height="18" /> WiFi 
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.kitchen ? 'yes': 'no'}`} color="black" height="18" /> {t("kitchen")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities['parking'] ? 'yes': 'no'}`} color="black" height="18" /> {t("parking")}
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.balcony ? 'yes': 'no'}`} color="black" height="18" /> {t("balcony")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.garden ? 'yes': 'no'}`} color="black" height="18" /> {t("garden")}
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.pool ? 'yes': 'no'}`} color="black" height="18" /> {t("pool")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities['hot tub'] ? 'yes': 'no'}`} color="black" height="18" /> {t("hot-tub")}
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.bbq ? 'yes': 'no'}`} color="black" height="18" /> {t("bbq-grill")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities['bedroom'] ? 'yes': 'no'}`} color="black" height="18" /> {t("room-stuff")}
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities['sports'] ? 'yes': 'no'}`} color="black" height="18" /> {t("sports")}
          </h1>
        </div>

        <div className='grid grid-cols-2'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.bathroom ? 'yes': 'no'}`} color="black" height="18" /> {t("bath-stuff")}
          </h1>
          <h1 className='mr-4 ml-5 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.pets ? 'yes': 'no'}`} color="black" height="18" /> {t("pets")}
          </h1>
        </div>
        
        <div className='grid grid-cols-1'>
          <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
            <Icon icon={`dashicons:${location.facilities.wash ? 'yes': 'no'}`} color="black" height="18" /> {t("wash")}
          </h1>
        </div>

        <button onClick={() => navigate("/host/add/facilities", {state: updatedState})} className="absolute bottom-1 right-3 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-7 py-0.75 px-2 rounded-full z-50">
          <Icon icon="clarity:edit-line" color="#233c3b" height="22" />
        </button>
      </div>

      <div className='flex flex-row mx-auto mb-4 gap-2'>
        {location.mode == "Rent" && (
          <button onClick={() => navigate(`/bookings/${location._id}`, {state: {user: state.user, location: location}})} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("current-bookings")}</button>
        )}
        <button onClick={() => navigate(`/locationRequests/${location._id}`, {state: {user: state.user, location:location}})} type="submit" className='inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("requests")}</button>
        <button onClick={handleDelete} type="submit" className='inline-block w-fit bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm duration-300 mt-8 text-white py-1 px-4 rounded-2xl'>{t("delete-residence")}</button>
      </div>
    </div>
  )
}

export default OwnListing