import React, {useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import QuestionCard from "./QuestionCard";
import Results from "./Results";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const Exam = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Get current user
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [viewingSolutions, setViewingSolutions] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/mock-tests/${testId}`
        );
        if (response?.data) {
          setTest({
            ...response.data,
            questions: response.data.questions || [],
          });
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching test:", error);
        navigate("/");
      }
    };

    fetchTest();
  }, [testId, navigate]);

  const handleEdit = () => {
    const current = test.questions?.[currentQuestionIndex];
    if (!current) return;
    const key = current._id || current.questionNumber;
    setEditedQuestions((prev) => ({
      ...prev,
      [key]: {
        ...current,
        options: current.options ? [...current.options] : [],
        terms: current.terms ? [...current.terms] : [],
        definitions: current.definitions
          ? current.definitions.map((d) => ({ ...d }))
          : [],
      },
    }));
    setEditingQuestionId(key);
  };

  const handleSaveQuestion = async (updatedQuestion) => {
    try {
      const testId = test._id;
      const questionNumber = updatedQuestion.questionNumber;
      const res = await axios.put(
        `${API_BASE_URL}/api/admin/mock-tests/${testId}/questions/${questionNumber}`,
        updatedQuestion
      );
      console.log("✅ Saved to DB:", res.data);
      const updatedQuestions = test.questions.map((q) =>
        q.questionNumber === questionNumber ? res.data.updatedQuestion : q
      );
      setTest((prevTest) => ({
        ...prevTest,
        questions: updatedQuestions,
      }));
      setEditedQuestions((prev) => {
        const updated = { ...prev };
        delete updated[updatedQuestion._id || updatedQuestion.questionNumber];
        return updated;
      });
    } catch (err) {
      console.error("❌ Error saving question:", err);
    }
  };

  const setEditedQuestion = (updated) => {
    const current = test.questions?.[currentQuestionIndex];
    if (!current) return;
    const key = current._id || current.questionNumber;
    setEditedQuestions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updated,
      },
    }));
  };

  const handleAnswerSelect = (questionId, selectedOption, correctAnswerOverride = null) => {
    const currentQuestion = test.questions[currentQuestionIndex];
    let correctAnswer;

    if (currentQuestion.questionType === "Drag and Drop") {
      correctAnswer = {};
      currentQuestion.definitions?.forEach((def) => {
        if (def.text && def.match) {
          correctAnswer[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
        }
      });
    } else {
      correctAnswer = correctAnswerOverride || (
        Array.isArray(currentQuestion.answer)
          ? currentQuestion.answer
          : [currentQuestion.answer]
      );
    }

    const normalize = (obj) =>
      Object.entries(obj || {})
        .map(([key, val]) => [key.toLowerCase().trim(), val.toLowerCase().trim()])
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");

    let isCorrect;

    if (currentQuestion.questionType === "Drag and Drop") {
      const givenMatches = {};
      Object.entries(selectedOption || {}).forEach(([def, term]) => {
        if (def && term) {
          givenMatches[def.toLowerCase().trim()] = term.toLowerCase().trim();
        }
      });
      isCorrect = normalize(correctAnswer) === normalize(givenMatches);
    } else {
      isCorrect = Array.isArray(selectedOption)
        ? selectedOption.sort().join(",") === correctAnswer.sort().join(",")
        : selectedOption === correctAnswer[0];
    }

    const updatedAnswers = {
      ...answers,
      [questionId]: {
        selectedOption,
        isCorrect,
        correctAnswer,
      },
    };

    setAnswers(updatedAnswers);

    if (isCorrect) {
      setScore((prevScore) => prevScore + (currentQuestion.marks || 1));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    setShowModal(false);
  };

  const viewSolutions = () => {
    setShowModal(false);
    setViewingSolutions(true);
  };

  if (!test) return <div className="text-center my-5">Loading...</div>;
  if (viewingSolutions) return <Results questions={test.questions} userAnswers={answers} />;

  const currentQuestion = test.questions[currentQuestionIndex] || {};
  const key = currentQuestion._id || currentQuestion.questionNumber;
  const isAnswered = currentQuestion.questionType === "Drag and Drop" || (!!key && !!answers[key]);

  const isStudent = user?.role === "student"; // ✅ Check if role is student
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">{test.title || "Test"}</h1>
      {currentQuestion.question ? (
        <QuestionCard
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          handleAnswerSelect={handleAnswerSelect}
          isEditing={editingQuestionId === key}
          editedQuestion={editedQuestions[key]}
          setEditedQuestion={setEditedQuestion}
          handleEdit={handleEdit}
          handleSave={handleSaveQuestion}
          setEditingQuestionId={setEditingQuestionId}
          showResults={viewingSolutions}
        />
      ) : (
        <div className="text-center my-5">No questions available.</div>
      )}

      <div className="d-flex mt-3 justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        {user?.role?.toLowerCase() === "student" && (
  <button
    className="btn btn-success"
    onClick={handleNext}
    disabled={!isAnswered}
  >
    {currentQuestionIndex < test.questions.length - 1
      ? "Next"
      : "Finish Exam"}
  </button>
)}

{["admin", "teacher", "management"].includes(user?.role?.toLowerCase()) &&
  currentQuestionIndex < test.questions.length - 1 && (
    <button className="btn btn-success" onClick={handleNext}>
      Next
    </button>
)}


      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Exam Finished</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>What would you like to do next?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={restartTest}>Restart Test</button>
                <button className="btn btn-secondary" onClick={viewSolutions}>View Solutions</button>
                <button className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
