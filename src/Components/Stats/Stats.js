import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Stats.module.css";

const Stats = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await axios({
        method: "get",
        url: "http://localhost:4000/api/quiz/stats",
        headers: { Authorization: `${token}` },
      });
      setStats(response.data);
    };
    fetchStats();
  }, [token]);

  const formatNumber = (num) => {
    return num > 1000 ? `${(num / 1000).toFixed(1)}K` : num;
  };

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statBox}>
        <span className={styles.quiz}>{stats.totalQuizzes} </span>
        <span className={styles.quiz}>Quiz Created</span>
      </div>
      <div className={styles.statBox}>
        <span className={styles.ques}>{stats.totalQuestions}</span>
        <span className={styles.ques}>Questions Created</span>
      </div>
      <div className={styles.statBox}>
        <span className={styles.impression}>
          {formatNumber(stats.totalImpressions)}
        </span>
        <span className={styles.impression}>Total Impressions</span>
      </div>
    </div>
  );
};

export default Stats;
