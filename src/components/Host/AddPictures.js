import React, { useState } from 'react'
import logo from '../../images/logo.png';

import { Icon } from '@iconify/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { storage } from '../../services/firebase';
import { server } from '../../services/axios';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"

const AddPictures = () => {
  const navigate = useNavigate();
  let {state} = useLocation();
  const {t} = useTranslation();

  const [input, setInput] = useState({});
  const [counter, setCounter] = useState(1);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);
  const [imageUpload3, setImageUpload3] = useState(null);
  const [imageUpload4, setImageUpload4] = useState(null);
  const [imageUpload5, setImageUpload5] = useState(null);
  const [error, setError] = useState('');


  const onSubmit = async (data) => {
    data.preventDefault();

    console.log(imageUpload);
    if(!imageUpload) {
      setError("No cover picture uploaded");
    }

    if (imageUpload) {
      const storageRef = ref(storage, `/${state.body.title}/cover`);
      uploadBytes(storageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          try {
            setError('');
            
            state.body = {...state.body, cover: url}
            if (!imageUpload2) navigate("/host/add/price", {state});
          } catch (e) {
            setError(e.message);
          }
        }).then(() => {
          if (imageUpload2) {
            const storageRef = ref(storage, `/${state.body.title}/img2`);
            uploadBytes(storageRef, imageUpload2).then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
                try {
                  setError('');
                  state.body = {...state.body, img2: url}
                  if (!imageUpload3) navigate("/host/add/price", {state});
                } catch (e) {
                  setError(e.message);
                }
              })
            }).then(() => {
              if (imageUpload3) {
                const storageRef = ref(storage, `/${state.body.title}/img3`);
                uploadBytes(storageRef, imageUpload3).then((snapshot) => {
                  getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    try {
                      setError('');
                      state.body = {...state.body, img3: url}
                      if (!imageUpload4) navigate("/host/add/price", {state});
                    } catch (e) {
                      setError(e.message);
                    }
                  })
                }).then(() => {
                  if (imageUpload4) {
                    const storageRef = ref(storage, `/${state.body.title}/img4`);
                    uploadBytes(storageRef, imageUpload4).then((snapshot) => {
                      getDownloadURL(snapshot.ref).then((url) => {
                        console.log(url);
                        try {
                          setError('');
                          state.body = {...state.body, img4: url}
                          if (!imageUpload5) navigate("/host/add/price", {state});
                        } catch (e) {
                          setError(e.message);
                        }
                      })
                    }).then(() => {
                      if (imageUpload5) {
                        const storageRef = ref(storage, `/${state.body.title}/img5`);
                        uploadBytes(storageRef, imageUpload5).then((snapshot) => {
                          getDownloadURL(snapshot.ref).then((url) => {
                            console.log(url);
                            try {
                              setError('');
                              state.body = {...state.body, img5: url}
                              navigate("/host/add/price", {state});
                            } catch (e) {
                              setError(e.message);
                            }
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      })
    }

    

    

    

    
    
  }

  console.log(input);

  return (
    <div className='min-w-screen h-screen grid grid-cols-2'>
      <div className='bg-gradient-to-b from-primary to-secondary flex relative'>
        <div className='absolute top-4 left-8'>
          <img className='w-16' src={logo} alt='logo'/>
        </div>
        <div className='ml-8 m-auto text-5xl font-serif font-bold text-textMain'>
          Add some pictures of your location
        </div>
      </div>
      <div className='bg-stone-100 flex flex-col'>

        <div className='absolute top-4 right-8 flex items-center gap-3'>
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate(-1, {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>{t("go-back")}</span>
          </button>
          
          <button class="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-500/70 flex items-center gap-1 mr-2" onClick={() => navigate("/host", {state})}>
            <Icon icon="akar-icons:arrow-back-thick-fill" color="#777" />
            <span className='text-lg font-serif'>Exit</span>
          </button>
        </div>

          { error && 
              
              <div class="mx-auto mt-14 bg-red-100 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md h-20" role="alert">
                <p class="font-bold">{t("error")}</p>
                <p class="text-sm">{error}</p>
              </div>
          }

        <div className={`h-128 2xl:h-256 ml-8 2xl:mx-auto ${error ? 'nt-1': 'mt-32'} mb-10 p-1 flex flex-col overflow-y-auto scrollbar-hide 2xl:px-36`}>
          <div className='flex flex-row mx-auto mb-6'>
            { imageUpload ? (
              <div className='flex'>
                <img src={URL.createObjectURL(imageUpload)} className='w-128 min-h-64 ml-10 mt-2'></img>
                <button onClick={() => setImageUpload(null)} class="relative top-4 right-16 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                  <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                </button>
              </div>
            ) : (
              <label className='mx-auto mt-2 w-128 h-64 bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
              hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer'>
                <Icon icon="ant-design:picture-outlined" color="#ddd" height="60" className='m-auto'/>
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload(e.target.files[0])} ></input>
              </label>
            )}
          </div>

          <div className='flex flex-row mx-auto mb-6'>
            { imageUpload2 ? (
              <div className='flex'>
                <img src={URL.createObjectURL(imageUpload2)} className='w-64 h-48 ml-12 mt-2 mr-8 ' />
                <button onClick={() => setImageUpload2(null)} class="relative top-4 right-24 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                  <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                </button>
              </div>
              
            ) : (
              <label className='w-64 h-48 mt-2 bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
              hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer'>
                <Icon icon="ant-design:picture-outlined" color="#ddd" height="60" className='m-auto'/>
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload2(e.target.files[0])} ></input>
              </label>
            )}

            { imageUpload3 ? (
              <div className='flex'>
                <img src={URL.createObjectURL(imageUpload3)} className='w-64 h-48 mt-2 mr-10' />
                <button onClick={() => setImageUpload3(null)} class="relative top-4 right-24 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                  <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                </button>
              </div>
              
            ) : (
              <label className={`w-64 h-48 ml-8 mt-2 ${imageUpload2 ? 'mr-12': ''} bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
              hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer`}>
                <Icon icon="ant-design:picture-outlined" color="#ddd" height="60" className='m-auto'/>
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload3(e.target.files[0])} ></input>
              </label>
            )}
          </div>

          <div className='flex flex-row mx-auto mb-6'>
            { imageUpload4 ? (
              <div className='flex'>
                <img src={URL.createObjectURL(imageUpload4)} className='w-64 h-48 ml-12 mt-2 mr-8 ' />
                <button onClick={() => setImageUpload4(null)} class="relative top-4 right-24 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                  <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                </button>
              </div>
              
            ) : (
              <label className='w-64 h-48 mt-2 bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
              hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer'>
                <Icon icon="ant-design:picture-outlined" color="#ddd" height="60" className='m-auto'/>
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload4(e.target.files[0])} ></input>
              </label>
            )}

            { imageUpload5 ? (
              <div className='flex'>
                <img src={URL.createObjectURL(imageUpload5)} className='w-64 h-48 mt-2 mr-10' />
                <button onClick={() => setImageUpload5(null)} class="relative top-4 right-24 text-gray-700 bg-primary/70 hover:bg-secondary transition-colors duration-300 font-bold w-10 h-10 py-2 px-2 rounded-full z-50">
                  <Icon icon="ant-design:delete-twotone" color="#233c3b" height="24" className=''/>
                </button>
              </div>
              
            ) : (
              <label className={`w-64 h-48 ml-8 mt-2 ${imageUpload4 ? 'mr-12': ''} bg-gray-500 flex rounded-3xl transition ease-in-out flex flex-col items-center tracking-wide uppercase
              hover:border-[#233c3b] hover:border-solid transition-colors duration-300 cursor-pointer`}>
                <Icon icon="ant-design:picture-outlined" color="#ddd" height="60" className='m-auto'/>
                <input type="file" id='profile_img' accept='image/*' className='hidden' onChange={(e) => setImageUpload5(e.target.files[0])} ></input>
              </label>
            )}
          </div>

          
          
        </div>

        <div class=" bg-gray-200 h-2 inset-x-0">
          <div class="bg-primary h-2" style={{width: "80%"}}></div>

        </div>
        <button type="submit" onClick={onSubmit} className=' 2xl:w-64 bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors duration-300 mt-8 w-28 text-white py-2 px-4 rounded-2xl self-end mr-10'>{t("next")}</button>


      </div>
    </div>
  )
}

export default AddPictures