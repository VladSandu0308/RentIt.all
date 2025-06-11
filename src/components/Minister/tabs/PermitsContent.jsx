import React from 'react';
import { Icon } from '@iconify/react';
import PermitReviewCard from '../components/PermitReviewCard';

const PermitsContent = ({ pendingPermits, handlePermitReview }) => {
  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Permise în Așteptare</h2>
        <div className='text-sm text-gray-600'>
          {pendingPermits.length} permise în așteptare
        </div>
      </div>
      
      {pendingPermits.length === 0 ? (
        <div className='text-center py-12'>
          <Icon icon="material-symbols:check-circle" height="64" className='text-green-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Toate permisele au fost procesate</h3>
          <p className='text-gray-600'>Nu există permise în așteptare pentru review</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {pendingPermits.map((permit) => (
            <PermitReviewCard 
              key={permit._id}
              permit={permit}
              onReview={handlePermitReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermitsContent;