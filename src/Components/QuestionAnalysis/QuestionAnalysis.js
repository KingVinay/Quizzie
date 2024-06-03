import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./QuestionAnalysis.module.css";

const QuestionAnalysis = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_HOST}/api/quiz/analytics/${quizId}`,
          headers: { Authorization: `${token}` },
        });
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [token, quizId]);

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.analysisContent}>
      <div className={styles.header}>
        <h1>{`${quizData.quizName} Question Analysis`}</h1>
        <div className={styles.headerInfo}>
          <span>{`Created on: ${new Date(quizData.createdAt)
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" ")}`}</span>
          <span>{`Impressions: ${quizData.impressions}`}</span>
        </div>
      </div>
      {quizData.questions.map((question, index) => (
        <div key={index} className={styles.questionSection}>
          <h2>{`Q.${index + 1} ${question.questionName}`}</h2>
          <div className={styles.box}>
            {quizData.quizType === "poll"
              ? renderPollOptions(question.options)
              : renderQAOptions(question, quizData)}
          </div>
          <hr className={styles.hline} />
        </div>
      ))}
    </div>
  );
};

const renderQAOptions = (question, quizData) => {
  return (
    <>
      <div className={styles.statsBox}>
        <span>{quizData.totalSubmissions}</span>
        <span>People Attempted the Questions</span>
      </div>
      <div className={styles.statsBox}>
        <span>{question.correctSubmissions}</span>
        <span>People Answered Correctly</span>
      </div>
      <div className={styles.statsBox}>
        <span>{question.wrongSubmissions}</span>
        <span>People Answered Incorrectly</span>
      </div>
    </>
  );
};

const renderPollOptions = (options) => {
  return options.map((option, index) => (
    <div key={index} className={styles.optionBox}>
      <span>{option.selectedCount} </span>
      <span>{`Option ${index + 1}`}</span>
    </div>
  ));
};

export default QuestionAnalysis;
