import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/UserAuthContext"

export default function PrivateRoute({ children, ...rest }) {
  const { currentUser } = useAuth()

  console.log(currentUser)

  if (!currentUser) {
    return (
      <Navigate to="/" />
    )
    
  }

  return children;
}