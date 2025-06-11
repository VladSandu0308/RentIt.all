import React from 'react';
import { Icon } from '@iconify/react';

const StatisticsContent = () => {
  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Statistici și Rapoarte</h2>
      
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center py-12'>
          <Icon icon="material-symbols:analytics" height="64" className='text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Statistici în dezvoltare</h3>
          <p className='text-gray-600 mb-8'>
            Această secțiune va conține rapoarte detaliate, analize și statistici despre platformă.
          </p>
          
          {/* Preview grid of future statistics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:trending-up" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Trafic Website</h4>
              <p className='text-2xl font-bold text-gray-400 mb-2'>--</p>
              <p className='text-sm text-gray-600'>Vizitatori unici săptămânali</p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:hotel" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Rezervări</h4>
              <p className='text-2xl font-bold text-gray-400 mb-2'>--</p>
              <p className='text-sm text-gray-600'>Rezervări luna curentă</p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:attach-money" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Venituri</h4>
              <p className='text-2xl font-bold text-gray-400 mb-2'>-- RON</p>
              <p className='text-sm text-gray-600'>Venituri generate</p>
            </div>
          </div>
          
          {/* Additional future features */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:pie-chart" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Grafice interactive</h4>
              <p className='text-sm text-gray-600'>
                Vizualizări grafice pentru analiza datelor în timp real
              </p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:download" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Export rapoarte</h4>
              <p className='text-sm text-gray-600'>
                Exportă rapoarte în format PDF, Excel și CSV
              </p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:schedule" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Rapoarte programate</h4>
              <p className='text-sm text-gray-600'>
                Primește rapoarte automate pe email
              </p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300'>
              <Icon icon="material-symbols:compare" height="32" className='text-gray-400 mx-auto mb-3' />
              <h4 className='font-medium text-gray-800 mb-2'>Analize comparative</h4>
              <p className='text-sm text-gray-600'>
                Compară performanța în diferite perioade
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsContent;