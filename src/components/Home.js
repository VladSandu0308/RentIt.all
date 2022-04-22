import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Box, Button, Modal, Typography } from '@mui/material';
import Login from './Login';
import Register from './Register';

const loginStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Home = () => {

  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsLogin(true);
  }

  return (
    <div className='site-wrapper'>
      <nav className='navbar navbar-expand-lg navbar-light bg-light justify-content-between'>
        <span className='navbar-brand mb-0 h1'>RentIt</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link secondary" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
            <Button onClick={handleOpen} color='inherit'>Join Us</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={loginStyle}>
                {
                  isLogin ? (
                    <Login setIsLogin={setIsLogin} />
                  ) : (
                    <Register setIsLogin={setIsLogin} />
                  )
                }
              </Box>
            </Modal>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Home