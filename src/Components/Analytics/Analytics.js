import React from "react";
import Navbar from "../Navbar/Navbar";
import AnalyticsTable from "../AnalyticsTable/AnalyticsTable";
import styles from "./Analytics.module.css";

const Analytics = () => {
  return (
    <div className={styles.analyticsContainer}>
      <Navbar option="Analytics" />
      <div className={styles.analyticsContent}>
        <h1 className={styles.heading}>Quiz Analysis</h1>
        <AnalyticsTable />
      </div>
    </div>
  );
};

export default Analytics;
