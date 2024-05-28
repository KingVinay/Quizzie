import { useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <div className={styles.navbar}>
      <div className={styles.top}>
        <h1>QUIZZIE</h1>
      </div>
      <div className={styles.middle}>
        <button
          className={`${styles.navbarButton} ${
            selected === "Dashboard" ? styles.selected : ""
          }`}
          onClick={() => setSelected("Dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`${styles.navbarButton} ${
            selected === "Analytics" ? styles.selected : ""
          }`}
          onClick={() => setSelected("Analytics")}
        >
          Analytics
        </button>
        <button
          className={`${styles.navbarButton} ${
            selected === "CreateQuiz" ? styles.selected : ""
          }`}
          onClick={() => setSelected("CreateQuiz")}
        >
          Create Quiz
        </button>
      </div>
      <div className={styles.bottom}>
        <div>
          <hr />
        </div>
        <button
          className={styles.navbarButton}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
