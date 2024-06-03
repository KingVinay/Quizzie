import React from "react";
import { useNavigate } from "react-router-dom";
import oops from "../../Assets/oops.avif";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <img src={oops} alt={"404"} />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default NotFound;
