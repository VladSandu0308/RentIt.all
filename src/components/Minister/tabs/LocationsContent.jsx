import React from 'react';
import { Icon } from '@iconify/react';
import Carousel from '../../Carousel';
import Pagination from '../../Pagination';

const LocationsContent = ({ 
  currentLocations, 
  locations, 
  handleDelete, 
  paginate, 
  currentPage, 
  perPage, 
  t 
}) => {
  const getStatusBadge = (status) => {
    // Safety check - dacă status este undefined, returnează un default
    if (!status || !status.status) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Icon icon="material-symbols:help" height="12" className="mr-1" />
          Status necunoscut
        </span>
      );
    }

    const config = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: 'material-symbols:check-circle' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'material-symbols:pending' },
      disabled: { bg: 'bg-red-100', text: 'text-red-800', icon: 'material-symbols:cancel' },
      no_permits: { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'material-symbols:help' }
    };
    
    const statusConfig = config[status.status] || config.no_permits;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon icon={statusConfig.icon} height="12" className="mr-1" />
        {status.label || 'Status necunoscut'}
      </span>
    );
  };

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

  const getPermitsSummary = (permits) => {
    if (!permits || permits.length === 0) {
      return { text: 'Fără permise', color: 'text-gray-500' };
    }

    const approved = permits.filter(p => p.status === 'approved').length;
    const pending = permits.filter(p => p.status === 'pending').length;
    const rejected = permits.filter(p => p.status === 'rejected').length;

    return {
      text: `${approved} aprobate, ${pending} în așteptare, ${rejected} respinse`,
      color: 'text-gray-600'
    };
  };
  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Gestionare Locații</h2>
        <div className='text-sm text-gray-600'>
          Total: {locations.length} locații
        </div>
      </div>
      
      {currentLocations.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg'>Nu există locații disponibile</div>
        </div>
      ) : (
        <>
          <div className="flex justify-around flex-wrap gap-6">
            {currentLocations.map((location) => (
              <div key={location._id} className='rounded-lg shadow-lg bg-white w-96 flex flex-col overflow-y-auto scrollbar-hide h-128 2xl:h-256 p-1'>
                <Carousel location={location} />
                
                <div className='pt-6 pb-10 flex justify-between relative'>
                  <h1 className='ml-4 text-2xl font-bold first-letter:uppercase'>{location.title}</h1>
                  <div className='mr-4 flex flex-col items-end space-y-2'>
                    <h1 className='text-xl font-bold first-letter:uppercase'>{location.mode}</h1>
                    {getStatusBadge(location.computedStatus)}
                  </div>
                </div>

                <hr className="h-0 border border-solid border-t-0 border-gray-400 opacity-25 mx-4" />

                {/* Location Details */}
                <div className='pt-4 pb-4 px-4'>
                  <div className='space-y-2 text-sm text-gray-600'>
                    {location.location && (
                      <div className='flex items-center'>
                        <Icon icon="material-symbols:location-on" height="16" className='mr-1' />
                        <span className='font-medium'>Locație:</span>
                        <span className='ml-2'>{location.location}</span>
                      </div>
                    )}
                    {location.price && (
                      <div className='flex items-center'>
                        <Icon icon="material-symbols:attach-money" height="16" className='mr-1' />
                        <span className='font-medium'>Preț:</span>
                        <span className='ml-2'>{location.price} RON</span>
                      </div>
                    )}
                    <div className='flex items-center'>
                      <Icon icon="material-symbols:description" height="16" className='mr-1' />
                      <span className='font-medium'>Permise:</span>
                      <span className={`ml-2 ${getPermitsSummary(location.permits).color}`}>
                        {getPermitsSummary(location.permits).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PDF Section */}
                {location.cerere && (
                  <div className='pt-6 pb-10 flex justify-between relative'>
                    <iframe
                      src={location.cerere}
                      width="100%"
                      height="500px"
                      title="PDF Viewer"
                      style={{ border: 'none' }}
                    ></iframe>
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex flex-row mx-auto mb-4 gap-2'>
                  <button 
                    onClick={() => handleDelete(location)} 
                    className='inline-block w-fit bg-red-600 hover:bg-red-700 transition-colors text-sm duration-300 mt-8 text-white py-2 px-4 rounded-2xl flex items-center'
                  >
                    <Icon icon="material-symbols:delete" height="16" className='mr-1' />
                    {t("delete-residence")}
                  </button>
                  
                  {location.permits && location.permits.length > 0 && (
                    <button 
                      onClick={() => {
                        // You could implement a callback to filter permits tab by location
                        alert(`Această locație are ${location.permits.length} permise:
${location.permits.map(p => `• ${getPermitTypeLabel(p.permit_type)}: ${p.status}`).join('\n')}

Verificați tab-ul Permise pentru detalii complete.`);
                      }}
                      className='inline-block w-fit bg-blue-600 hover:bg-blue-700 transition-colors text-sm duration-300 mt-8 text-white py-2 px-4 rounded-2xl flex items-center'
                    >
                      <Icon icon="material-symbols:list-alt" height="16" className='mr-1' />
                      Vezi permise ({location.permits.length})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='mt-8 flex justify-center'>
            <Pagination 
              perPage={perPage} 
              totalPosts={locations.length} 
              paginate={paginate} 
              currentPage={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LocationsContent;