import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CreateQuiz.module.css";

const CreateQuiz = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionName: "",
      optionType: "text",
      options: [{ text: "", imageUrl: "" }],
      correctOption: null,
      timer: "OFF",
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
          options: [{ text: "", imageUrl: "" }],
          correctOption: null,
          timer: "OFF",
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
    newQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/quiz/create",
        {
          quizName,
          quizType,
          questions,
        }
      );
      setShareableLink(response.data.link);
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
            <div className={styles.questionContainer}>
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
                                { text: "", imageUrl: "" },
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
                            value="image"
                            checked={question.optionType === "image"}
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[questionIndex].optionType = "image";
                              newQuestions[questionIndex].options = [
                                { text: "", imageUrl: "" },
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
                            value="text-image"
                            checked={question.optionType === "text-image"}
                            onChange={() => {
                              const newQuestions = [...questions];
                              newQuestions[questionIndex].optionType =
                                "text-image";
                              newQuestions[questionIndex].options = [
                                { text: "", imageUrl: "" },
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
                                  checked={
                                    question.correctOption === optionIndex
                                  }
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
                                x
                              </button>
                            )}
                          </div>
                        ))}

                      {question.optionType === "image" &&
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.option}>
                            {quizType === "q&a" && (
                              <label className={styles.correctOptionLabel}>
                                <input
                                  type="radio"
                                  name={`correctOption${questionIndex}`}
                                  checked={
                                    question.correctOption === optionIndex
                                  }
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
                                x
                              </button>
                            )}
                          </div>
                        ))}

                      {question.optionType === "text-image" &&
                        question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.option}>
                            {quizType === "q&a" && (
                              <label className={styles.correctOptionLabel}>
                                <input
                                  type="radio"
                                  name={`correctOption${questionIndex}`}
                                  checked={
                                    question.correctOption === optionIndex
                                  }
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
                                x
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
                          <label>
                            <input
                              type="radio"
                              name={`timer${questionIndex}`}
                              value="OFF"
                              checked={question.timer === "OFF"}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[questionIndex].timer =
                                  e.target.value;
                                setQuestions(newQuestions);
                              }}
                            />
                            OFF
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`timer${questionIndex}`}
                              value="5s"
                              checked={question.timer === "5s"}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[questionIndex].timer =
                                  e.target.value;

                                setQuestions(newQuestions);
                              }}
                            ></input>
                            5s
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`timer${questionIndex}`}
                              value="10s"
                              checked={question.timer === "10s"}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[questionIndex].timer =
                                  e.target.value;
                                setQuestions(newQuestions);
                              }}
                            />
                            10s
                          </label>
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
            <h1>Congrats, your quiz is published!</h1>
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
