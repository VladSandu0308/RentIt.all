import React from 'react';
import { Icon } from '@iconify/react';

const DashboardContent = ({ locations, pendingPermits, setActiveTab }) => {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard Administrare</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Locations Card */}
        <div 
          onClick={() => setActiveTab('locations')}
          className='bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Locații totale</p>
              <p className='text-3xl font-bold text-gray-900'>{locations.length}</p>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <Icon icon="material-symbols:location-on" height="24" className='text-blue-600' />
            </div>
          </div>
        </div>

        {/* Pending Permits Card */}
        <div 
          onClick={() => setActiveTab('permits')}
          className='bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Permise în așteptare</p>
              <p className='text-3xl font-bold text-gray-900'>{pendingPermits.length}</p>
            </div>
            <div className='bg-yellow-100 p-3 rounded-full'>
              <Icon icon="material-symbols:pending-actions" height="24" className='text-yellow-600' />
            </div>
          </div>
        </div>

        {/* Blog Card */}
        <div 
          onClick={() => setActiveTab('blog')}
          className='bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Gestionare Blog</p>
              <p className='text-lg font-semibold text-gray-900'>Adaugă postare</p>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <Icon icon="dashicons:welcome-write-blog" height="24" className='text-green-600' />
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div 
          onClick={() => setActiveTab('statistics')}
          className='bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Statistici</p>
              <p className='text-lg font-semibold text-gray-900'>Vezi rapoarte</p>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <Icon icon="material-symbols:analytics" height="24" className='text-purple-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Acțiuni rapide</h3>
        <div className='flex flex-wrap gap-4'>
          {pendingPermits.length > 0 && (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center'>
              <Icon icon="material-symbols:warning" height="20" className='text-yellow-600 mr-2' />
              <span className='text-yellow-800'>
                Aveți {pendingPermits.length} permise în așteptare
              </span>
              <button 
                onClick={() => setActiveTab('permits')}
                className='ml-4 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700'
              >
                Revizuiește
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Section */}
      <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Activity */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4'>Activitate recentă</h4>
          <div className='space-y-3'>
            <div className='flex items-center text-sm text-gray-600'>
              <Icon icon="material-symbols:check-circle" height="16" className='text-green-500 mr-2' />
              Ultima actualizare locații
            </div>
            <div className='flex items-center text-sm text-gray-600'>
              <Icon icon="material-symbols:pending" height="16" className='text-yellow-500 mr-2' />
              Permise în așteptare de review
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h4 className='text-lg font-semibold text-gray-800 mb-4'>Status sistem</h4>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Locații active</span>
              <span className='text-sm font-semibold text-green-600'>
                {locations.filter(loc => loc.activated).length}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Locații inactive</span>
              <span className='text-sm font-semibold text-red-600'>
                {locations.filter(loc => !loc.activated).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;