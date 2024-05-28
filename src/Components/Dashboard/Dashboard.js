import React from "react";
import Navbar from "../Navbar/Navbar";
import Stats from "../Stats/Stats";
import TrendingQuiz from "../TrendingQuiz/TrendingQuiz";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <Navbar option="Dashboard" />
      <div className={styles.content}>
        <Stats />
        <TrendingQuiz />
      </div>
    </div>
  );
};

export default Dashboard;
