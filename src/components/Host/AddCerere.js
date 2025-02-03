import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { server } from '../../services/axios';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { storage } from '../../services/firebase';

const AddCerere = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState(null);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const onSubmit = async e => {
    e.preventDefault();

    console.log(input);
    if(!input) {
        setError("No file uploaded");
    } else {
        const storageRef = ref(storage, `/${state.body.title}/cerere`);
        //const storageRef = ref(storage, `/test/cerere`);

        uploadBytes(storageRef, input).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
            try {
                setError('');
                state.body = {...state.body, cerere: url}
                navigate("/host/add/review", {state});
            } catch (e) {
                setError(e.message);
            }
            })
        })
    }

  }
  
  return (
    <div className='min-w-screen min-h-screen grid grid-cols-2'>
        <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
            <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='my-auto mx-8 text-5xl font-serif font-bold text-textMain'>
            {t("add-cerere")}
        </div>
        </div>
        <div className='bg-stone-100 flex flex-col relative'>
        <div className='relative top-4 right-8 flex items-center gap-3'>
            <button class="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-24 top-0" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
            </button>
            
            <button class="absolute px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 right-0 top-0" onClick={() => navigate("/host", {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("exit")}</span>
            </button>
            { error && 
                
                <div class="mx-auto mt-14 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20 absolute inset-x-56 top-0" role="alert">
                <p class="font-bold">{t("error")}</p>
                <p class="text-sm">{error}</p>
                </div>
            }
        </div>

        <div className={`h-128 2xl:h-256 ml-8 2xl:mx-auto ${error ? 'nt-1': 'mt-20'} mb-40 flex flex-col overflow-y-auto scrollbar-hide 2xl:px-36`}>
            <div className='flex flex-row mx-auto mb-40'>
                { input ? (
                <div className='flex'>
                   <iframe
                        src={URL.createObjectURL(input)}
                        width="500px"  // Or a specific width
                        height="500px" // Or a specific height
                        title="PDF Viewer" // Add a title for accessibility
                        style={{ border: 'none' }} // Optional: remove the iframe border
                    ></iframe>
                    <button onClick={() => setInput(null)} class="relative top-2 right-12 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                        <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                    </button>
                </div>
                ) : (
                <label className='mx-auto mt-2 w-128 h-96 bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
                hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer'>
                    <Icon icon="teenyicons:pdf-solid" color="#ddd" height="60" className='m-auto'/>
                    <input type="file" id='cerere' accept='.pdf' className='hidden' onChange={(e) => setInput(e.target.files[0])} ></input>
                </label>
                )}
            </div>
        </div>

        {/* <div className="flex flex-col items-center">
            <label htmlFor="fileInput" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Încarcă PDF
            </label>
            <input id="fileInput" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            {selectedFile && <p className="mt-2 text-gray-700">Fișier selectat: {selectedFile.name}</p>}
        </div> */}

        <div class="bg-gray-200 h-2 relative inset-x-0 bottom-20">
            <div class="bg-primary h-2" style={{width: "95%"}}></div>
        </div>
        <button type="submit" onClick={onSubmit} className='absolute bottom-6 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>

        </div>
    </div>
  )
}

export default AddCerere