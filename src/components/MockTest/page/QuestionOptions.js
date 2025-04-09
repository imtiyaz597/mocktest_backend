import React, { useState } from "react";

const QuestionOptions = ({
  currentQuestion,
  answers,
  handleAnswerSelect,
  isEditing = false,
  editedQuestion,
  setEditedQuestion,
}) => {
  const [draggedTerm, setDraggedTerm] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});

  const questionData = isEditing ? editedQuestion : currentQuestion;

  const handleDrop = (defText) => {
    if (draggedTerm) {
      const updatedPairs = { ...matchedPairs, [defText]: draggedTerm };
      setMatchedPairs(updatedPairs);

      const correctPairs = questionData.answer || {};
      let isCorrect = true;

      for (const def in correctPairs) {
        if (updatedPairs[def] !== correctPairs[def]) {
          isCorrect = false;
          break;
        }
      }

      if (Object.keys(updatedPairs).length === Object.keys(correctPairs).length) {
        handleAnswerSelect(currentQuestion._id, updatedPairs, correctPairs, isCorrect);
      }

      setDraggedTerm(null);
    }
  };

  const renderDragAndDrop = () => {
    const terms = questionData.terms || [];
    const definitions = questionData.definitions || [];
    const usedTerms = Object.values(matchedPairs);

    if (isEditing) {
      return <div>Edit Mode...</div>;
    }

    return (
      <div className="row">
        <div className="col-md-6">
          <h5>Terms</h5>
          <ul className="list-group">
            {terms
              .filter((term) => !usedTerms.includes(term))
              .map((term, idx) => (
                <li
                  key={idx}
                  className="list-group-item"
                  draggable
                  onDragStart={() => setDraggedTerm(term)}
                >
                  {term}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Definitions</h5>
          <ul className="list-group">
            {definitions.map((def, idx) => (
              <li
                key={idx}
                className="list-group-item"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(def.text)}
              >
                {def.text}
                {matchedPairs[def.text] && (
                  <div className="mt-1 text-primary">
                    → {matchedPairs[def.text]}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderSingleSelect = () => {
    const options = questionData.options || [];
    const selected = answers[currentQuestion._id]?.selectedOption;

    return options.map((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const isSelected = selected === val;

      return (
        <div
          key={idx}
          className={`p-2 border rounded my-2 ${
            isSelected ? "bg-primary text-white" : "bg-light"
          }`}
          onClick={() => handleAnswerSelect(currentQuestion._id, val)}
          style={{ cursor: "pointer" }}
        >
          {val}. {opt.text}
        </div>
      );
    });
  };

  const renderMultiSelect = () => {
    const options = questionData.options || [];
    const selected = answers[currentQuestion._id]?.selectedOption || [];

    return options.map((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const isSelected = selected.includes(val);

      return (
        <div
          key={idx}
          className={`p-2 border rounded my-2 ${
            isSelected ? "bg-primary text-white" : "bg-light"
          }`}
          onClick={() => {
            const updated = isSelected
              ? selected.filter((v) => v !== val)
              : [...selected, val];
            handleAnswerSelect(currentQuestion._id, updated);
          }}
          style={{ cursor: "pointer" }}
        >
          {val}. {opt.text}
        </div>
      );
    });
  };

  if (questionData.questionType === "Drag and Drop") return renderDragAndDrop();
  if (questionData.questionType === "Multi-Select") return renderMultiSelect();

  return renderSingleSelect();
};

export default QuestionOptions;
