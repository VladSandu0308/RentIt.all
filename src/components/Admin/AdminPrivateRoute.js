import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../../context/UserAuthContext"
import useUser from '../../hooks/useUser';

export default function AdminPrivateRoute({ children, ...rest }) {
  const { currentUser } = useAuth();
  const {user} = useUser();

  if (!user || user?.email != 'rentit.all.oficial@gmail.com') {
    return (
      <Navigate to="/admin" />
    )
    
  }

  return children;
}