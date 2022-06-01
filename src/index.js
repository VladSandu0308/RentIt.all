import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './i18next';
import { BrowserRouter } from 'react-router-dom';

import 'tw-elements';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
