import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AnalyticsTable.module.css";
import EditQuiz from "../EditQuiz/EditQuiz";

const Table = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [deleteQuizId, setDeleteQuizId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_HOST}/api/quiz/all`,
          headers: { Authorization: `${token}` },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [token]);

  const handleDelete = async (quizId) => {
    try {
      await axios({
        method: "delete",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/quiz/delete/${quizId}`,
        headers: { Authorization: `${token}` },
      });
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      toast.success("Quiz deleted successfully");
      setDeleteQuizId(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const handleShare = async (quizId) => {
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/quiz/share/${quizId}`,
        headers: { Authorization: `${token}` },
      });
      navigator.clipboard.writeText(response.data.shareableLink);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Error sharing quiz:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Quiz Name</th>
            <th>Created On</th>
            <th>Impressions</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr
              key={quiz._id}
              className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
            >
              <td>{index + 1}</td>
              <td>{quiz.quizName}</td>
              <td>
                {new Date(quiz.createdAt)
                  .toDateString()
                  .split(" ")
                  .slice(1)
                  .join(" ")}
              </td>
              <td>{quiz.impressions}</td>
              <td>
                <div className={styles.icons}>
                  <span
                    style={{ color: "#854CFF" }}
                    onClick={() => {
                      setIsModalOpen(quiz._id);
                    }}
                  >
                    <i class="fa fa-edit fa-2x"></i>
                  </span>
                  {isModalOpen === quiz._id && (
                    <EditQuiz
                      key={quiz._id}
                      onClose={() => setIsModalOpen(null)}
                      quizId={quiz._id}
                    />
                  )}
                  <span
                    style={{ color: "#D60000" }}
                    onClick={() => setDeleteQuizId(quiz._id)}
                  >
                    <i class="fa fa-trash fa-2x"></i>
                  </span>
                  <span
                    style={{ color: "#60B84B" }}
                    onClick={() => handleShare(quiz._id)}
                  >
                    <i class="fa fa-share-alt fa-2x"></i>
                  </span>
                </div>
              </td>

              <td>
                <Link to={`/quizAnalysis/${quiz._id}`}>
                  <span>
                    <u>Question Wise Analysis</u>
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deleteQuizId && (
        <div className={styles.modalBox}>
          <div className={styles.modalBoxContent}>
            <p>Are you confirm you want to delete ?</p>
            <div className={styles.modalButtons}>
              <button onClick={() => handleDelete(deleteQuizId)}>
                Confirm Delete
              </button>
              <button onClick={() => setDeleteQuizId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
