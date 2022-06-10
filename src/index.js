import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './services/i18next';
import { BrowserRouter } from 'react-router-dom';

import 'tw-elements';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
