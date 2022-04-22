import React, { useState } from "react"
import { useAuth } from "../context/UserAuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Alert } from "@mui/material"

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate();

  async function handleLogout() {
    setError("")

    try {
      await logout()
      navigate("/");
    } catch {
      setError("Failed to log out")
    }
  }

  console.log(currentUser.email);

  return (
    <>
      <div className="card shadow mb-4 mx-auto" style={{top: '15rem', width: '32rem' }}>
        <div className='card-header bg-secondary' style={{height: '5rem'}}></div>
        <div className="card-body text-center">
          {error && <Alert severity="error">{error}</Alert>}
          <h3 className="card-title border-bottom mb-2 font-weight-bold">My Profile</h3>
          <strong>Email:</strong> {currentUser.email}

          <div className='row g-3 mb-4'>
            <div className='col-md-12 d-flex justify-content-center gap-3'>
              <button type="button" className="btn btn-dark w-100 mt-3 font-weight-bold" onClick={handleLogout} >Logout</button>
              <Link to="/update-profile" className="btn btn-dark w-100 mt-3 font-weight-bold">
                Update Profile
              </Link>
            </div>
          </div>
          
          
          

        </div>
        <div className='card-footer bg-secondary' style={{height: '5rem'}}></div>
      </div>
    </>
  )
}