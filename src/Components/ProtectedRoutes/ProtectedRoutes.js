import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../ProtectedRoutes/Authenticated";

const ProtectedRoute = (props) => {
  const { Component } = props;
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Is Authenticated:", isAuthenticated);
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
