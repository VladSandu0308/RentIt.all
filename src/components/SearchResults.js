
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { server } from '../services/axios';
import { Icon } from '@iconify/react';
import Footer from './Footer';
import OwnListing from './Host/OwnListing';
import Listing from './Listing';
import Navbar from './Navbar';
import Pagination from './Pagination';
import { useForm } from 'react-hook-form';
import { Datepicker } from '@mobiscroll/react';
import useInput from '../hooks/useInput';

const SearchResults = () => {
  let {state} = useLocation();
  console.log(state);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [locations, setLocations] = useState([]);

  
  const [furnished, setFurnished] = useState("Any");
  const [reload, setReload] = useState(state.body);
  const [retMessage, setRetMessage] = useState("");

  const [adults, setAdults] = useState(state?.body?.adults);
  const [kids, setKids] = useState(state?.body?.kids)

  const [start, setStart] = useState(state?.body?.start);
  const [end, setEnd] = useState(state?.body?.end);

  const [location, setLocation] = useState(state?.body?.location);
  const [showLoc, setShowLoc] = useState(state?.body?.location)
  const [coords, setCoords] = useState(state?.body?.coords);
  const address = useInput("");


  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  let currentLocations = [];
  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;
  currentLocations = locations?.slice(firstIndex, lastIndex);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const onSubmit = async (data) => {
    
    console.log(data);

    if (location) {
      data = {...data, location, coords}
      setShowLoc(location);
    }

    if (start && end) {
      const startDate = new Date(start.getTime() - (start.getTimezoneOffset() * 60000));
      const endDate = new Date(end.getTime() - (end.getTimezoneOffset() * 60000));
      data = {...data, start: startDate, end: endDate}
    }

    if (adults) {
      data = {...data, adults}
    }

    if (kids) {
      data = {...data, kids}
    }

    data = {...data, furnished, mode: state.body.mode};
    console.log("data");
    console.log(data);
    
    setLocations([]);
    setRetMessage("");
    setReload(data);
    
  }

  

  useEffect(() => {
    server.post(`/getLocations/${state.user.email}`, reload).then(ret => {setRetMessage(ret.data.message); setLocations(ret.data.locations)}); 
  }, [reload]);

  if (locations.length == 0) {

  }


  return (
    <div className='min-w-screen h-screen grid grid-rows-9 z-0'>
      <div className='bg-primary flex-flex-row sticky top-0'>
        <Navbar current={t("search-house")} state={state} className="z-20"/>
      </div>
      <div className='row-span-8 bg-secondary grid grid-cols-4'>
        {
          locations.length == 0 ? (
            retMessage == "This user has no locations" ? (
                <div class="col-span-3 flex items-center justify-center">
                  <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("no-results")}</h1>

                </div>
              ) : (
                <div class="col-span-3 flex items-center justify-center">
                  <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              )            
          ) : (
            <div class="col-span-3 ">
              <div className='flex items-center ml-4 mb-3'>
                <Icon icon="cil:search" color="#3ea1a9" rotate={1} className="mr-2" height="30"/>
                <h1 className='text-[#3ea1a9] text-4xl font-ultra font-bold '>{t("your-results")} {showLoc ? showLoc?.split(',')[0] : t("around-romania")}</h1>
              </div>

              <div className='grid grid-cols-3 mt-2 ml-4 gap-4'>
                {
                  currentLocations.map((location) => (
                    <Listing state={state} location={location} body={reload} />
                  ))
                }
                <div className='bg-secondary absolute inset-x-0 left-96 bottom-3 w-80'>

                  <Pagination perPage={perPage} totalPosts={locations.length} paginate={paginate} currentPage={currentPage}/>
                </div>
                
              </div>
            </div>
          )
        }

        <form onSubmit={handleSubmit(onSubmit)} className='bg-primary  border-t-2 border-solid border-gray-400 flex flex-col overflow-y-auto scrollbar-hide py-8'>
          <h1 className='ml-6 mb-16 font-bold text-[#233c3b]  mr-6 text-3xl font-serif transition-colors duration-300'>{t("select-filters")}</h1>
          
          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("search-location")}</h1>
          <div className='my-3 mx-auto relative flex items-center gap-20'>
            <Icon icon="entypo:location-pin" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input value={location} autoComplete="off" placeholder={t("Anywhere")} className='price-range w-80 h-12 pl-10 pr-1' onChange={e => {setLocation(e.target.value); address.onChange(e);}}/>
                  {
                      address.suggestions?.length > 0 && (
                        <div className='bg-[#aad0d3] absolute top-12 w-128 py-2 px-1 z-10 rounded-2xl'>
                          {
                            address.suggestions.map((suggestion, index) => {
                              return (
                                <p className='cursor-pointer hover:bg-[#ecf0f0] max-w-96 py-1 text-xs' key={index} onClick={() => {
                                  address.setValue(suggestion.place_name);
                                  address.setSuggestions([]);
                                  setLocation(suggestion.place_name);
                                  setCoords(suggestion.center);
                                }} >
                                  {suggestion.place_name}
                                </p>
                              )
                            })
                          }
                        </div>
                      )
                  }
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          {
            reload.mode == "Rent" && 
            <h1 className='ml-6 text-[#233c3b]  mr-6 text-lg font-serif transition-colors duration-300'>{t("available-dates")}</h1>
          }

          
            {
              reload.mode == "Rent" && 
              <div className='flex justify-around mb-3 mx-auto gap-6 mt-3'>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <Datepicker value={start} onChange={e => setStart(e.value)} controls={['calendar']} touchUi={true} display='anchored' min={new Date()} inputComponent="input" inputProps={{placeholder: t("start-date"), class: 'date-range w-36 h-12 pr-1 pl-8'}}/>
                </div>
                <div className='basis-1/2 relative flex items-center'>
                  <Icon icon="ant-design:calendar-twotone" color="#233c3b" height="24" className='absolute ml-2 pb-0.5'/>
                  <Datepicker value={end} onChange={e => setEnd(e.value)}  controls={['calendar']} display='anchored' min={start} touchUi={true} inputComponent="input" inputProps={{placeholder: t("end-date"), class: 'date-range  w-36 h-12 pr-1 pl-8'}} />
                </div>
              </div>
            }

          {
            reload.mode == "Rent" && 
            <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />
          }

          

          <h1 className='ml-6 text-[#233c3b]  mr-6 text-lg font-serif transition-colors duration-300'>{t("minimum-persons")}</h1>

          <div className='flex justify-around mb-3 mx-auto gap-6 mt-3'>

            <div className='mx-auto my-auto relative flex items-center'>
              <Icon icon="bi:person-fill" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input onChange={e => setAdults(e.target.value)} type="number" step="1" min="1" placeholder={t("adults")} className='price-range w-36 h-12 pr-1 pl-8'/>
            </div>

            <div className='mx-auto my-auto relative flex items-center gap-20'>
              <Icon icon="bi:person-fill" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input onChange={e => setKids(e.target.value)} type="number" step="1" min="1" placeholder={t("kids")} className='price-range w-36 h-12 pr-1 pl-8'/>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />
          
          <h1 className='ml-6 text-[#233c3b]  mr-6 text-lg font-serif transition-colors duration-300'>{t("price-range")}</h1>

          <div className='flex justify-around mb-3 mx-auto gap-6 mt-3'>

            <div className='mx-auto my-auto relative flex items-center'>
              <Icon icon="healthicons:money-bag" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input {...register("min_price")} type="number" step="5" min="50" placeholder={t("min-price")} className='price-range w-36 h-12 pr-1 pl-10'/>
            </div>

            <div className='mx-auto my-auto relative flex items-center gap-20'>
              <Icon icon="healthicons:money-bag" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
              <input {...register("max_price")} type="number" step="5" min="50" placeholder={t("max-price")} className='price-range w-36 h-12 pr-1 pl-10'/>
            </div>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("max-dist")} (km)</h1>
          <div className='my-3 mx-auto relative flex items-center gap-20'>
            <Icon icon="icon-park-solid:map-distance" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input {...register("max_dist")} type="number" min="1" max="20000000" placeholder={t("type-here")} className='price-range w-56 h-12 pr-1'/>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("key-words")}</h1>
          <div className='my-3 mx-auto relative flex items-center gap-20'>
            <Icon icon="bi:file-earmark-word-fill" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input autoComplete='off' {...register("search")} placeholder={t("type-here")} className='price-range w-56 h-12 pr-1'/>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("min-rooms")}</h1>
          <div className='my-3 mx-auto relative flex items-center gap-20'>
            <Icon icon="ic:baseline-bedroom-child" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input {...register("min_rooms")} type="number" step="1" min="1" max="200" placeholder={t("min-rooms")} className='price-range w-56 h-12 pr-1'/>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("min-baths")}</h1>
          <div className='my-3 mx-auto relative flex items-center gap-20'>
            <Icon icon="ic:baseline-bathroom" color="#233c3b" height="36" className='absolute ml-2 mb-1 select-none'/>
            <input {...register("min_baths")} type="number" step="1" min="1" max="200" placeholder={t("min-baths")} className='price-range w-56 h-12 pr-1'/>
          </div>

          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />

          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("furnished")} </h1>
          <div className='basis-1/4 relative flex items-center my-3'>
                <Icon icon="bi:house-door-fill" color="#233c3b" height="36" className='absolute ml-16 pb-0.5'/>
                <select onChange={e => setFurnished(e.target.value)} className='select-furnished w-56 h-16 py-2.5'>
                  <option selected value="Any">{t("any")}</option>
                  <option value="Yes">{t("yes")}</option>
                  <option className='' value="No">{t("no")}</option>
                </select>
                <Icon icon="gridicons:dropdown" color="black" height="24" className='right-16 absolute'/>
          </div>

            
          <hr class="h-0 border border-solid border-t-1 border-gray-400 opacity-80 mx-6 mb-3" />
          <h1 className='ml-6 text-[#233c3b] mr-6 text-lg font-serif transition-colors duration-300'>{t("facilities")} </h1>


          <div className='flex flex-col py-6 pb-10 relative mx-auto'>
            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex'>
                <input {...register("facilities.AC")} class="form-check-input facilities-checkbox" type="checkbox" value=""/>
                 Air Conditioning
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.heat")} class="form-check-input facilities-checkbox" type="checkbox" value=""/>
                {t("heat")} 
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='mx-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.wifi")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                 WiFi 
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.kitchen")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("kitchen")} 
              </h1>
              
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.parking")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("parking")} 
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.balcony")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("balcony")} 
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.garden")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("garden")}
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.pool")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("pool")} 
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.hot tub")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("hot-tub")}
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.bbq")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("bbq-grill")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.bedroom")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("room-stuff")}
              </h1>
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.sports")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("sports")}
              </h1>
            </div>

            <div className='grid grid-cols-2'>
              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.bathroom")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("bath-stuff")}
              </h1>
              
              <h1 className='mr-4 ml-10 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.pets")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                {t("pets")}
              </h1>
            </div>
            <div className='grid grid-cols-1'>

              <h1 className='ml-3 text-sm first-letter:uppercase flex items-center'>
                <input {...register("facilities.wash")} class="form-check-input facilities-checkbox" type="checkbox" value=""  />
                 {t("wash")}
              </h1>
            </div>
          </div>

          <div className='flex flex-row mx-auto mb-4 gap-2'>
            <button type="submit" className='uppercase inline-block w-fit  bg-[#3ea1a9] hover:bg-[#3ea1a9]/80 transition-colors text-sm 2xl:text-xl duration-300 mt-8 text-white py-1 px-4 2xl:px-12 2xl:py-3 rounded-2xl'>{t("apply-filters")}</button>
          </div>



          
        </form>
        

        
      </div>
       
    </div>
  )
}

export default SearchResults