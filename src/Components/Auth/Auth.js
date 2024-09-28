import React, { useState } from "react";
import { Link } from "react-router-dom";

import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";

import styles from "./Auth.module.css";

const Auth = (value) => {
  const [selectedForm, setSelectedForm] = useState("login");

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.authHeading}>QUIZZIE</h1>
        <div className={styles.authButtons}>
          <Link to={`/signup`}>
            <button
              className={`${styles.authButton} ${
                selectedForm === "signup" ? styles.selected : ""
              }`}
              onClick={() => setSelectedForm("signup")}
            >
              Sign Up
            </button>
          </Link>
          <Link to={`/login`}>
            <button
              className={`${styles.authButton} ${
                selectedForm === "login" ? styles.selected : ""
              }`}
              onClick={() => setSelectedForm("login")}
            >
              Log In
            </button>
          </Link>
        </div>
        <div className={styles.formContainer}>
          {selectedForm === "signup" ? <SignUp /> : <Login />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
