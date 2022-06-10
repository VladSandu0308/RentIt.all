import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, getJson, setOptions } from '@mobiscroll/react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../Navbar';
import Footer from '../Footer';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

function Bookings() {
    const min = '2022-06-09T00:00';
    const [singleLabels, setSingleLabels] = React.useState([]);
    const [singleInvalid, setSingleInvalid] = React.useState([]);
    
    const onPageLoadingSingle = React.useCallback((event, inst) => {
        getPrices(event.firstDay, (bookings) => {
            setSingleLabels(bookings.labels);
            setSingleInvalid(bookings.invalid);
        	
        });
    }, []);

    const getPrices = (d, callback) => {
        let invalid = [];
        let labels = [];

        getJson('https://trial.mobiscroll.com/getprices/?year=' + d.getFullYear() + '&month=' + d.getMonth(), (bookings) => {
            for (let i = 0; i < bookings.length; ++i) {
                const booking = bookings[i];
                const d = new Date(booking.d);

                if (booking.price > 0) {
                    labels.push({
                        start: d,
                        title: '$' + booking.price,
                        textColor: '#e1528f'
                    });
                } else {
                    invalid.push(d);
                }
            }
            callback({ labels: labels, invalid: invalid });
        }, 'jsonp');
    }
    
    const {state} = useLocation();

    console.log(state);
    const {t} = useTranslation();

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
                colors={[
                  {
                    start: new Date(2022, 0, 10),
                    end: new Date(2022, 7, 15),
                    background: '#ffbaba80'
                  }
                ]}
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