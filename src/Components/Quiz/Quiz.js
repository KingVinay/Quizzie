import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./Quiz.module.css";

const Quiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/quiz/quizbyid/${quizId}`
        );
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const splitAndConvert = (inputString) => {
    return inputString.split(" ").map((item) => {
      return item.endsWith("s") ? parseInt(item.slice(0, -1), 10) : item;
    });
  };

  useEffect(() => {
    if (
      quizData &&
      quizData.quizType === "q&a" &&
      quizData.questions[currentQuestionIndex].timer
    ) {
      const convertedTimer = splitAndConvert(
        quizData.questions[currentQuestionIndex].timer
      );
      setTimer(convertedTimer);
    }
  }, [currentQuestionIndex, quizData]);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/quiz/submit/${quizId}`,
        {
          answers: selectedOptions,
        }
      );
      setQuizData({ ...quizData, results: response.data });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  }, [quizData, quizId, selectedOptions]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentQuestionIndex, handleSubmit, quizData]);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
    } else if (timer !== null) {
      const intervalId = setInterval(() => {
        setTimer((timer) => (timer > 0 ? timer - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer, handleNext]);

  const handleOptionSelect = (optionIndex, optionId) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = {
      questionId: quizData.questions[currentQuestionIndex]._id,
      selectedOptionId: optionId,
    };
    setSelectedOptions(newSelectedOptions);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className={styles.quizComponent}>
      <div className={styles.quizContainer}>
        <div className={styles.quizHeader}>
          <div>{`0${currentQuestionIndex + 1} / 0${
            quizData.questions.length
          }`}</div>
          {quizData.quizType === "q&a" && currentQuestion.timer && (
            <div className={styles.timer}>{`00:${
              timer < 10 ? `0${timer}` : timer
            }s`}</div>
          )}
        </div>
        <div className={styles.question}>{currentQuestion.questionName}</div>
        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`${styles.option} ${
                selectedOptions[currentQuestionIndex]?.selectedOptionId ===
                option._id
                  ? styles.selectedOption
                  : ""
              }`}
              onClick={() => handleOptionSelect(index, option._id)}
            >
              {currentQuestion.optionType === "text" && (
                <span>{option.text}</span>
              )}
              {currentQuestion.optionType === "image url" && (
                <img src={option.imageUrl} alt="option" />
              )}
              {currentQuestion.optionType === "text and image url" && (
                <div className={styles.optionContent}>
                  <span>{option.text}</span>
                  <img src={option.imageUrl} alt="option" />
                </div>
              )}
            </div>
          ))}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>
          {isLastQuestion ? "Submit" : "Next"}
        </button>
      </div>
      {quizData.results && (
        <div className={styles.resultContainer}>
          {quizData.quizType === "q&a" ? (
            <>
              <div>Congrats! Quiz is Completed</div>
              <img src="trophy.png" alt="Trophy" />
              <div>{`Your Score: ${quizData.results.correctAnswers}/${quizData.questions.length}`}</div>
            </>
          ) : (
            <div>Thank you for participating in the poll!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
