import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../../context/UserAuthContext"
import useUser from '../../hooks/useUser';

export default function MinisterPrivateRoute({ children, ...rest }) {
  const { currentUser } = useAuth();
  const {user} = useUser();

  if (!user || user?.email != 'minister@rentit.all') {
    return (
      <Navigate to="/minister" />
    )
    
  }

  return children;
}