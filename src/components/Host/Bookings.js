import React, { useEffect, useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, getJson, setOptions, formatDate } from '@mobiscroll/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAlert } from 'react-alert';
import { server } from '../../services/axios';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const now = new Date();

function Bookings() {
  const {state} = useLocation();
  console.log(state);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const alert = useAlert();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [retMessage, setRetMessage] = useState("");
  const [colors, setColors] = useState([]);

    useEffect(() => {
      server.get(`/getLocationBookings/${state.location._id}`).then(ret => {
        
        let tempUsers = {}
        let tempColors = []
        console.log(ret)
        setRetMessage(ret.data.message);
        
        for(let i = 0; i < ret?.data?.bookings?.length; ++i) {
          server.get(`/getUserById/${ret.data.bookings[i].user_id}`).then(ret2 => {
            
            tempUsers = {...tempUsers, [ret.data.bookings[i].user_id]: ret2.data.user}
            tempColors = [...tempColors, {
              start: ret.data.bookings[i].from,
              end: ret.data.bookings[i].to,
              background: '#ffbaba80'
            }]
  
            if(i == ret.data.bookings.length - 1) {
              setUsers(tempUsers)
              setRequests(ret.data.bookings)
              setColors(tempColors);
            }
          })
        } 
      }); 
    }, []);

    console.log(colors)
    return (
      <div className='min-w-screen min-h-screen grid grid-rows-9 z-0'>
        <div className='bg-primary flex-flex-row sticky top-0'>
          <Navbar current={t("host-functions")} state={state} className="z-20"/>
        </div>
        <div className='row-span-8 bg-secondary flex'>
          <div className=" bg-secondary h-fit w-256 mx-auto my-16">
            <div className="mbsc-form-group-title font-semibold">Single date & appointment booking</div>
              <Datepicker 
                display="inline"
                controls={['calendar']}
                colors={colors}
                pages="2"
              />
            </div>

        </div>
          
        <div className='bottom-0'>
          <Footer />   
        </div>
        
      </div>
    )
      
        
}

export default Bookings;