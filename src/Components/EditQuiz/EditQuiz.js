import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditQuiz.module.css";

const EditQuiz = ({ onClose, quizId }) => {
  const [step, setStep] = useState(1);
  const token = localStorage.getItem("token");
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/quiz/quizbyid/${quizId}`
        );
        setQuizData(response.data);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          questionName: "",
          optionType: "text",
          options: [{ text: "", imageUrl: "", isCorrect: false }],
          timer: "none",
        },
      ]);
      setActiveQuestionIndex(questions.length);
    }
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
    setActiveQuestionIndex(Math.max(0, index - 1));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionSelect = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, index) => {
      option.isCorrect = index === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleTimerChange = (questionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].timer = value;
    setQuestions(newQuestions);
  };

  const validateStep = () => {
    return questions.every((question) => {
      if (question.questionName.trim() === "") return false;
      if (question.options.length < 2) return false;
      return question.options.every((option) => {
        if (question.optionType === "text" && option.text.trim() === "")
          return false;
        if (
          question.optionType === "image url" &&
          option.imageUrl.trim() === ""
        )
          return false;
        if (
          question.optionType === "text and image url" &&
          (option.text.trim() === "" || option.imageUrl.trim() === "")
        )
          return false;
        return true;
      });
    });
  };

  const handleEditQuiz = async () => {
    if (!validateStep()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      await axios({
        method: "patch",
        url: `http://localhost:4000/api/quiz/edit/${quizId}`,
        headers: { Authorization: `${token}` },
        data: {
          questions,
        },
      });
      setStep(3);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {step === 1 && (
          <div>
            <div className={styles.questionIndexContainer}>
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.questionCircle} ${
                    index === activeQuestionIndex ? styles.active : ""
                  }`}
                  onClick={() => setActiveQuestionIndex(index)}
                >
                  {index + 1}
                  {index > 0 && (
                    <button
                      className={styles.removeQuestionButton}
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      x
                    </button>
                  )}
                </button>
              ))}
              {questions.length < 5 && (
                <button
                  className={styles.addQuestionButton}
                  onClick={handleAddQuestion}
                >
                  +
                </button>
              )}
              <span>Max 5 questions</span>
            </div>
            <div className={styles.scrollableContainer}>
              {questions.map(
                (question, questionIndex) =>
                  questionIndex === activeQuestionIndex && (
                    <div key={questionIndex} className={styles.question}>
                      <input
                        type="text"
                        placeholder="Question"
                        value={question.questionName}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[questionIndex].questionName =
                            e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className={styles.input}
                      />
                      <div className={styles.optionTypeContainer}>
                        <span>Option Type</span>
                        <label>
                          <input
                            type="radio"
                            name={`optionType${questionIndex}`}
                            value="text"
                            checked={question.optionType === "text"}
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[questionIndex].optionType = "text";
                              newQuestions[questionIndex].options = [
                                { text: "", imageUrl: "", isCorrect: false },
                                { text: "", imageUrl: "", isCorrect: false },
                              ];
                              setQuestions(newQuestions);
                            }}
                          />
                          Text
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`optionType${questionIndex}`}
                            value="image url"
                            checked={question.optionType === "image url"}
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[questionIndex].optionType =
                                "image url";
                              newQuestions[questionIndex].options = [
                                { text: "", imageUrl: "", isCorrect: false },
                                { text: "", imageUrl: "", isCorrect: false },
                              ];
                              setQuestions(newQuestions);
                            }}
                          />
                          Image URL
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`optionType${questionIndex}`}
                            value="text and image url"
                            checked={
                              question.optionType === "text and image url"
                            }
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[questionIndex].optionType =
                                "text and image url";
                              newQuestions[questionIndex].options = [
                                { text: "", imageUrl: "", isCorrect: false },
                                { text: "", imageUrl: "", isCorrect: false },
                              ];
                              setQuestions(newQuestions);
                            }}
                          />
                          Text & Image URL
                        </label>
                      </div>

                      {question.optionType === "text" &&
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.option}>
                            {quizData.quizType === "q&a" && (
                              <label className={styles.correctOptionLabel}>
                                <input
                                  type="radio"
                                  name={`correctOption${questionIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    handleCorrectOptionSelect(
                                      questionIndex,
                                      optionIndex
                                    )
                                  }
                                />
                              </label>
                            )}
                            <input
                              type="text"
                              placeholder="Text"
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              className={styles.input}
                            />
                            {optionIndex > 1 && (
                              <button
                                className={styles.removeOptionButton}
                                onClick={() => {
                                  const newQuestions = [...questions];
                                  newQuestions[questionIndex].options.splice(
                                    optionIndex,
                                    1
                                  );
                                  setQuestions(newQuestions);
                                }}
                              >
                                <span style={{ color: "red" }}>
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            )}
                          </div>
                        ))}

                      {question.optionType === "image url" &&
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.option}>
                            {quizData.quizType === "q&a" && (
                              <label className={styles.correctOptionLabel}>
                                <input
                                  type="radio"
                                  name={`correctOption${questionIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    handleCorrectOptionSelect(
                                      questionIndex,
                                      optionIndex
                                    )
                                  }
                                />
                              </label>
                            )}
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={option.imageUrl}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "imageUrl",
                                  e.target.value
                                )
                              }
                              className={styles.input}
                            />
                            {optionIndex > 1 && (
                              <button
                                className={styles.removeOptionButton}
                                onClick={() => {
                                  const newQuestions = [...questions];
                                  newQuestions[questionIndex].options.splice(
                                    optionIndex,
                                    1
                                  );
                                  setQuestions(newQuestions);
                                }}
                              >
                                <span style={{ color: "red" }}>
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            )}
                          </div>
                        ))}

                      {question.optionType === "text and image url" &&
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.option}>
                            {quizData.quizType === "q&a" && (
                              <label className={styles.correctOptionLabel}>
                                <input
                                  type="radio"
                                  name={`correctOption${questionIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    handleCorrectOptionSelect(
                                      questionIndex,
                                      optionIndex
                                    )
                                  }
                                />
                              </label>
                            )}
                            <input
                              type="text"
                              placeholder="Text"
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              className={styles.input}
                            />
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={option.imageUrl}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "imageUrl",
                                  e.target.value
                                )
                              }
                              className={styles.input}
                            />
                            {optionIndex > 1 && (
                              <button
                                className={styles.removeOptionButton}
                                onClick={() => {
                                  const newQuestions = [...questions];
                                  newQuestions[questionIndex].options.splice(
                                    optionIndex,
                                    1
                                  );
                                  setQuestions(newQuestions);
                                }}
                              >
                                <span style={{ color: "red" }}>
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            )}
                          </div>
                        ))}

                      {question.options.length < 4 && (
                        <button
                          className={styles.addOptionButton}
                          onClick={() => {
                            const newQuestions = [...questions];
                            newQuestions[questionIndex].options.push({
                              text: "",
                              imageUrl: "",
                            });
                            setQuestions(newQuestions);
                          }}
                        >
                          Add Option
                        </button>
                      )}

                      {quizData.quizType === "q&a" && (
                        <div className={styles.timerContainer}>
                          <h3>Timer</h3>
                          <div className={styles.timerButtons}>
                            <button
                              className={`${styles.timerButton} ${
                                question.timer === "none" ? styles.active : ""
                              }`}
                              onClick={() =>
                                handleTimerChange(questionIndex, "none")
                              }
                            >
                              OFF
                            </button>
                            <button
                              className={`${styles.timerButton} ${
                                question.timer === "5s" ? styles.active : ""
                              }`}
                              onClick={() =>
                                handleTimerChange(questionIndex, "5s")
                              }
                            >
                              5s
                            </button>
                            <button
                              className={`${styles.timerButton} ${
                                question.timer === "10s" ? styles.active : ""
                              }`}
                              onClick={() =>
                                handleTimerChange(questionIndex, "10s")
                              }
                            >
                              10s
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>

            <div className={styles.buttonContainer}>
              <button onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleEditQuiz} className={styles.createButton}>
                Edit Quiz
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.successContainer}>
            <button onClick={onClose} className={styles.closeButton}>
              X
            </button>
            <h1>Congrats, your Quiz is Published!</h1>
            <div className={styles.linkContainer}>
              <span>{quizData.shareableLink}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(quizData.shareableLink);
                  toast.success("Link copied to clipboard");
                }}
                className={styles.shareButton}
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditQuiz;
