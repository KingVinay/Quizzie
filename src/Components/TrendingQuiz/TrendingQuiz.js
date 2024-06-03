import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TrendingQuiz.module.css";
import "font-awesome/css/font-awesome.min.css";

import { Link } from "react-router-dom";

const TrendingQuiz = () => {
  const token = localStorage.getItem("token");
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/quiz/trending`,
        headers: { Authorization: `${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    };
    fetchQuizzes();
  }, [token]);

  return (
    <div className={styles.trendingContainer}>
      <h1>Trending Quiz's</h1>
      <div className={styles.quizGrid}>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className={styles.quizCard}>
            <div className={styles.innerCard}>
              <Link to={`/quiz/${quiz._id}`} className={styles.link}>
                <span>{quiz.quizName}</span>
              </Link>
              <p className={styles.impression}>
                {quiz.impressions}
                <i className="fa fa-eye"></i>
              </p>
            </div>
            <p className={styles.date}>
              Created on:{" "}
              {new Date(quiz.createdAt)
                .toDateString()
                .split(" ")
                .slice(1)
                .join(" ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingQuiz;
