import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoutes";
import Analytics from "./Components/Analytics/Analytics";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Auth value="signup" />} />
        <Route path="/login" element={<Auth value="login" />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute Component={Dashboard} />}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute Component={Analytics} />}
        />
        <Route path="/" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
