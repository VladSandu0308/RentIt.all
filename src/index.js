import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './services/i18next';
import { positions, Provider, transitions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { BrowserRouter } from 'react-router-dom';

import 'tw-elements';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import "react-datepicker/dist/react-datepicker.css";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
};

ReactDOM.render(
  <Provider template={AlertTemplate} {...options}>
    <App />
  </Provider>,
  document.getElementById('root')
);
