import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoutes";
import Analytics from "./Components/Analytics/Analytics";
import QuizAnalysis from "./Components/QuizAnalysis/QuizAnalyis";
import Quiz from "./Components/Quiz/Quiz";
import NotFound from "./Components/NotFound/NotFound";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
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

          <Route
            path="/quizAnalysis/:quizId"
            element={<ProtectedRoute Component={QuizAnalysis} />}
          />

          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
