import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/UserAuthContext"
import useUser from '../hooks/useUser';

export default function PrivateRoute({ children, ...rest }) {
  const { currentUser } = useAuth();
  const {user} = useUser();

  if (!user) {
    return (
      <Navigate to="/login" />
    )
    
  }

  return children;
}