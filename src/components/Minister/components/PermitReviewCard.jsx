import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const PermitReviewCard = ({ permit, onReview }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [permitNumber, setPermitNumber] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    if (!permitNumber.trim()) {
      alert('Introduceți numărul permisului');
      return;
    }
    onReview(permit._id, 'approved', permitNumber, '');
    setIsReviewing(false);
    setPermitNumber('');
    setRejectionReason('');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Introduceți motivul respingerii');
      return;
    }
    onReview(permit._id, 'rejected', '', rejectionReason);
    setIsReviewing(false);
    setPermitNumber('');
    setRejectionReason('');
  };

  const handleCancel = () => {
    setIsReviewing(false);
    setPermitNumber('');
    setRejectionReason('');
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

  const getPermitTypeIcon = (type) => {
    const icons = {
      businessLicense: 'material-symbols:business',
      shortTermRental: 'material-symbols:home',
      mountainTourism: 'material-symbols:landscape',
      ecotourism: 'material-symbols:eco',
      culturalHeritage: 'material-symbols:museum',
      ruralTourism: 'material-symbols:agriculture'
    };
    return icons[type] || 'material-symbols:description';
  };

  return (
    <div className='bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='p-4'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-start space-x-3'>
            <div className='bg-blue-100 p-2 rounded-lg'>
              <Icon 
                icon={getPermitTypeIcon(permit.permit_type)} 
                height="20" 
                className='text-blue-600' 
              />
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>
                {getPermitTypeLabel(permit.permit_type)}
              </h4>
              <p className='text-sm text-gray-600 mt-1'>
                {permit.location_details?.title}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                📍 {permit.location_details?.location}
              </p>
              <p className='text-xs text-gray-500'>
                👤 {permit.location_details?.host_email}
              </p>
            </div>
          </div>
          
          <div className='flex items-center space-x-2'>
            <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'>
              În așteptare
            </span>
            <a 
              href={permit.document_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className='bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm transition-colors flex items-center'
            >
              <Icon icon="material-symbols:open-in-new" height="16" className='mr-1' />
              Vezi document
            </a>
          </div>
        </div>

        {!isReviewing ? (
          <div className='flex justify-end'>
            <button 
              onClick={() => setIsReviewing(true)}
              className='bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors'
            >
              <Icon icon="material-symbols:rate-review" height="16" className='mr-1' />
              Procesează permis
            </button>
          </div>
        ) : (
          <div className='border-t pt-4 mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Icon icon="material-symbols:badge" height="16" className='inline mr-1' />
                  Număr permis (pentru aprobare)
                </label>
                <input
                  type="text"
                  value={permitNumber}
                  onChange={(e) => setPermitNumber(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder="ex: PM-2024-001"
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Icon icon="material-symbols:close" height="16" className='inline mr-1' />
                  Motiv respingere (pentru respingere)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent'
                  placeholder="ex: Document incomplet"
                />
              </div>
            </div>
            
            <div className='flex justify-end space-x-2'>
              <button 
                onClick={handleCancel}
                className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center'
              >
                <Icon icon="material-symbols:cancel" height="16" className='mr-1' />
                Anulează
              </button>
              <button 
                onClick={handleReject}
                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center'
              >
                <Icon icon="material-symbols:close" height="16" className='mr-1' />
                Respinge
              </button>
              <button 
                onClick={handleApprove}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center'
              >
                <Icon icon="material-symbols:check" height="16" className='mr-1' />
                Aprobă
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermitReviewCard;