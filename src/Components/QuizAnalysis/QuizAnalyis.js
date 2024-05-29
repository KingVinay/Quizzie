import React from "react";
import Navbar from "../Navbar/Navbar";
import QuestionAnalysis from "../QuestionAnalysis/QuestionAnalysis";
import styles from "./QuizAnalysis.module.css";

const QuizAnalysis = () => {
  return (
    <div className={styles.analysisContainer}>
      <Navbar />
      <div className={styles.analysisContent}>
        <QuestionAnalysis />
      </div>
    </div>
  );
};

export default QuizAnalysis;
