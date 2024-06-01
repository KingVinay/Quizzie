import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  const { Component } = props;
  const token = localStorage.getItem("token");

  return <>{token ? <Component /> : Navigate("/login")}</>;
}
