import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TrendingQuiz.module.css";
import "font-awesome/css/font-awesome.min.css";

const TrendingQuiz = () => {
  const token = localStorage.getItem("token");
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await axios({
        method: "get",
        url: "http://localhost:4000/api/quiz/all",
        headers: { Authorization: `${token}` },
      });
      setQuizzes(response.data);
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
              <span>{quiz.quizName}</span>
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
