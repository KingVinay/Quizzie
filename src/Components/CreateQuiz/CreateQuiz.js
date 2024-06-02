import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CreateQuiz.module.css";

const CreateQuiz = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const token = localStorage.getItem("token");
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionName: "",
      optionType: "text",
      options: [{ text: "", imageUrl: "", isCorrect: false }],
      timer: "none",
    },
  ]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [shareableLink, setShareableLink] = useState("");

  const handleQuizTypeSelect = (type) => {
    setQuizType(type);
  };

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

  const handleRemoveQuestion = (index, e) => {
    e.stopPropagation();
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

  const validateStep1 = () => {
    return quizName.trim() !== "" && quizType !== "";
  };

  const validateStep2 = () => {
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

  const handleCreateQuiz = async () => {
    if (!validateStep1() || !validateStep2()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/api/quiz/create",
        headers: { Authorization: `${token}` },
        data: {
          quizName,
          quizType,
          questions,
        },
      });

      setShareableLink(response.data.shareableLink);
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
            <input
              type="text"
              placeholder="Quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.quizTypeContainer}>
              <span>Quiz Type</span>
              <div
                className={`${styles.quizTypeButton} ${
                  quizType === "q&a" ? styles.selected : ""
                }`}
                onClick={() => handleQuizTypeSelect("q&a")}
              >
                Q & A
              </div>
              <div
                className={`${styles.quizTypeButton} ${
                  quizType === "poll" ? styles.selected : ""
                }`}
                onClick={() => handleQuizTypeSelect("poll")}
              >
                Poll Type
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className={styles.continueButton}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
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
                      onClick={(e) => handleRemoveQuestion(index, e)}
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
                            {quizType === "q&a" && (
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
                            {quizType === "q&a" && (
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
                            {quizType === "q&a" && (
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

                      {quizType === "q&a" && (
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
              <button
                onClick={() => setStep(1)}
                className={styles.cancelButton}
              >
                Back
              </button>
              <button
                onClick={handleCreateQuiz}
                className={styles.createButton}
              >
                Create Quiz
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
              <span>{shareableLink}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareableLink);
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

export default CreateQuiz;
