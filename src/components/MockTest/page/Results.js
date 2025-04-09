import React, { useState } from "react";

const Results = ({ questions, userAnswers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return <div>No questions available to display results.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers?.[currentQuestion._id];
  const options = currentQuestion?.options || [];
  let correctAnswer = currentQuestion?.answer;

  // ✅ Proper comparison logic for Drag and Drop
  let isCorrect = userAnswer?.isCorrect;

  if (
    currentQuestion.questionType === "Drag and Drop" &&
    typeof userAnswer?.selectedOption === "object"
  ) {
    const expected = {};
    currentQuestion.definitions?.forEach((def) => {
      if (def.text && def.match) {
        expected[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
      }
    });

    const given = {};
    Object.entries(userAnswer.selectedOption || {}).forEach(([def, term]) => {
      if (def && term) {
        given[def.toLowerCase().trim()] = term.toLowerCase().trim();
      }
    });

    const normalize = (obj) =>
      Object.entries(obj)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");

    isCorrect = normalize(expected) === normalize(given);
  }

  const formatUserAnswer = () => {
    if (
      currentQuestion.questionType === "Drag and Drop" &&
      typeof userAnswer?.selectedOption === "object"
    ) {
      return Object.entries(userAnswer.selectedOption)
        .map(([definition, term]) => `${term}: ${definition}`)
        .join(", ");
    }

    if (typeof userAnswer?.selectedOption === "object") {
      return Object.entries(userAnswer.selectedOption)
        .map(([def, term]) => `${term}: ${def}`)
        .join(", ");
    }

    if (Array.isArray(userAnswer?.selectedOption)) {
      return userAnswer.selectedOption.join(", ");
    }

    return userAnswer?.selectedOption || "None";
  };

  let formattedCorrectAnswer = correctAnswer;

  if (
    currentQuestion.questionType === "Drag and Drop" &&
    Array.isArray(correctAnswer) &&
    Array.isArray(currentQuestion.terms) &&
    Array.isArray(currentQuestion.definitions)
  ) {
    formattedCorrectAnswer = currentQuestion.definitions.map((def) => {
      const term = def.match;
      const definition = def.text;
      return `${term}: ${definition}`;
    });
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const displayIsCorrect = isCorrect;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Test Results</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {currentQuestion.questionNumber}: {currentQuestion.question}
          </h5>
          <p>
            <strong>Question Type:</strong>{" "}
            {currentQuestion.questionType || "N/A"}
          </p>

          {Array.isArray(options) ? (
            <ul className="list-group">
              {options.map((option) => {
                const isCorrectOption = Array.isArray(correctAnswer)
                  ? correctAnswer.includes(option._id)
                  : correctAnswer === option._id;
                const isSelectedOption = Array.isArray(userAnswer?.selectedOption)
                  ? userAnswer.selectedOption.includes(option._id)
                  : userAnswer?.selectedOption === option._id;

                return (
                  <li
                    key={option._id || option.label}
                    className={`list-group-item ${
                      isCorrectOption
                        ? "list-group-item-success"
                        : isSelectedOption
                        ? "list-group-item-danger"
                        : ""
                    }`}
                  >
                    {`${option.label}: ${option.text}`}
                    {isCorrectOption && <strong> (Correct)</strong>}
                    {isSelectedOption && !isCorrectOption && (
                      <strong> (Your Selection)</strong>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : typeof options === "object" ? (
            <ul className="list-group">
              {Object.entries(options).map(([key, value]) => {
                const isCorrectOption = correctAnswer?.[key] === value;
                const isSelectedOption =
                  userAnswer?.selectedOption?.[key] === value;

                return (
                  <li
                    key={key}
                    className={`list-group-item ${
                      isCorrectOption
                        ? "list-group-item-success"
                        : isSelectedOption
                        ? "list-group-item-danger"
                        : ""
                    }`}
                  >
                    {`${key}: ${value}`}
                    {isCorrectOption && <strong> (Correct)</strong>}
                    {isSelectedOption && !isCorrectOption && (
                      <strong> (Your Selection)</strong>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No valid options available.</p>
          )}

          <p className="mt-3">
            <strong>Your Answer:</strong> {formatUserAnswer()}
          </p>

          <p>
            <strong>Correct Answer:</strong>{" "}
            {Array.isArray(formattedCorrectAnswer)
              ? formattedCorrectAnswer.join(", ")
              : formattedCorrectAnswer || "None"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                displayIsCorrect ? "bg-success" : "bg-danger"
              }`}
            >
              {displayIsCorrect ? "Correct" : "Incorrect"}
            </span>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Results;