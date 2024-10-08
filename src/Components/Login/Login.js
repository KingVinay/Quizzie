import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("guest@quizzie.com");
  const [password, setPassword] = useState("asdf@1234");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/api/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response?.data?.token);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
