import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const BlogContent = ({ state, t }) => {
  const navigate = useNavigate();

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Gestionare Blog</h2>
      
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <Icon icon="dashicons:welcome-write-blog" height="64" className='text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Adaugă o postare nouă</h3>
          <p className='text-gray-600 mb-6'>
            Creează și publică conținut pentru blog. Împărtășește informații utile despre destinații, 
            sfaturi de călătorie și noutăți din industria turismului.
          </p>
          
          <button 
            onClick={() => navigate("/admin/blog", {state})} 
            className="px-6 py-3 bg-primary hover:bg-primary/80 transition-colors text-white rounded-lg flex items-center mx-auto"
          >
            <Icon icon="dashicons:welcome-write-blog" height="20" className='mr-2' />
            {t("add-blog-post")}
          </button>
        </div>
      </div>

      {/* Future features placeholder */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300'>
          <Icon icon="material-symbols:list-alt" height="32" className='text-gray-400 mb-3' />
          <h4 className='font-semibold text-gray-700 mb-2'>Lista postărilor</h4>
          <p className='text-sm text-gray-600'>
            Vizualizează și gestionează postările existente (în dezvoltare)
          </p>
        </div>

        <div className='bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300'>
          <Icon icon="material-symbols:edit" height="32" className='text-gray-400 mb-3' />
          <h4 className='font-semibold text-gray-700 mb-2'>Editor avansat</h4>
          <p className='text-sm text-gray-600'>
            Editor rich-text cu opțiuni avansate de formatare (în dezvoltare)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;