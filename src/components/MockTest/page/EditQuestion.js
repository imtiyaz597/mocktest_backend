// const EditQuestion = ({
//     editedQuestion,
//     setEditedQuestion,
//     handleSave,
//     setEditingQuestion,
//   }) => {
//     if (!editedQuestion) return null;
  
//     const handleEditChange = (e) => {
//       const { name, value } = e.target;
//       setEditedQuestion({
//         ...editedQuestion,
//         [name]: name === "questionNumber" ? Number(value) || "" : value,
//       });
//     };
  
//     const handleOptionChange = (e, index) => {
//       const { value } = e.target;
//       const updatedOptions = [...(editedQuestion.options || [])];
//       updatedOptions[index] = { ...updatedOptions[index], text: value };
//       setEditedQuestion({
//         ...editedQuestion,
//         options: updatedOptions,
//       });
//     };
  
//     const handleCorrectAnswerChange = (e) => {
//       const { value } = e.target;
//       setEditedQuestion({
//         ...editedQuestion,
//         answer: value,
//       });
//     };
  
//     return (
//       <>
//         <input
//           type="number"
//           name="questionNumber"
//           className="form-control mb-2"
//           value={editedQuestion.questionNumber || ""}
//           onChange={handleEditChange}
//           placeholder="Question Number"
//         />
//         <input
//           type="text"
//           name="question"
//           className="form-control mb-2"
//           value={editedQuestion.question || ""}
//           onChange={handleEditChange}
//           placeholder="Enter Question"
//         />
  
//         {Array.isArray(editedQuestion.options) &&
//           editedQuestion.options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               className="form-control mb-2"
//               value={option.text || ""}
//               onChange={(e) => handleOptionChange(e, index)}
//               placeholder={`Option ${String.fromCharCode(65 + index)}`}
//             />
//           ))}
  
//         <select
//           className="form-control mb-2"
//           value={editedQuestion.answer || ""}
//           onChange={handleCorrectAnswerChange}
//         >
//           <option value="">Select Correct Answer</option>
//           {Array.isArray(editedQuestion.options) &&
//             editedQuestion.options.map((_, index) => (
//               <option key={index} value={String.fromCharCode(65 + index)}>
//                 {String.fromCharCode(65 + index)}
//               </option>
//             ))}
//         </select>
  
//         <textarea
//           name="explanation"
//           className="form-control mb-2"
//           value={editedQuestion.explanation || ""}
//           onChange={handleEditChange}
//           placeholder="Explanation (optional)"
//         />
  
//         <button
//           className="btn btn-success me-2"
//           onClick={() => {
//             handleSave(editedQuestion);
//             setEditingQuestion(null);
//           }}
//         >
//           Save
//         </button>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setEditingQuestion(null)}
//         >
//           Cancel
//         </button>
//       </>
//     );
//   };
  
//   export default EditQuestion;
  


// const EditQuestion = ({
//     editedQuestion,
//     setEditedQuestion,
//     handleSave,
//     setEditingQuestion,
//   }) => {
//     if (!editedQuestion) return null;
  
//     const handleEditChange = (e) => {
//       const { name, value } = e.target;
//       setEditedQuestion({
//         ...editedQuestion,
//         [name]: name === "questionNumber" ? Number(value) || "" : value,
//       });
//     };
  
//     const handleOptionChange = (e, index) => {
//       const { value } = e.target;
//       const updatedOptions = [...(editedQuestion.options || [])];
//       updatedOptions[index] = { ...updatedOptions[index], text: value };
//       setEditedQuestion({
//         ...editedQuestion,
//         options: updatedOptions,
//       });
//     };
  
//     const handleCorrectAnswerChange = (e) => {
//       const { value } = e.target;
//       setEditedQuestion({
//         ...editedQuestion,
//         answer: value,
//       });
//     };
  
//     return (
//       <>
//         <input
//           type="number"
//           name="questionNumber"
//           className="form-control mb-2"
//           value={editedQuestion.questionNumber || ""}
//           onChange={handleEditChange}
//           placeholder="Question Number"
//         />
//         <input
//           type="text"
//           name="question"
//           className="form-control mb-2"
//           value={editedQuestion.question || ""}
//           onChange={handleEditChange}
//           placeholder="Enter Question"
//         />


// {Array.isArray(editedQuestion.terms) &&
//   editedQuestion.terms.map((term, index) => (
//     <input
//       key={`term-${index}`}
//       type="text"
//       className="form-control mb-2"
//       value={term || ""}
//       onChange={(e) => {
//         const updatedTerms = [...editedQuestion.terms];
//         updatedTerms[index] = e.target.value;
//         setEditedQuestion({ ...editedQuestion, terms: updatedTerms });
//       }}
//       placeholder={`Term ${index + 1}`}
//     />
//   ))}

// {Array.isArray(editedQuestion.definitions) &&
//   editedQuestion.definitions.map((definitionObj, index) => (
//     <input
//       key={`definition-${index}`}
//       type="text"
//       className="form-control mb-2"
//       value={definitionObj?.text || ""}
//       onChange={(e) => {
//         const updatedDefinitions = [...editedQuestion.definitions];
//         updatedDefinitions[index] = {
//           ...updatedDefinitions[index],
//           text: e.target.value,
//         };
//         setEditedQuestion({
//           ...editedQuestion,
//           definitions: updatedDefinitions,
//         });
//       }}
//       placeholder={`Definition ${index + 1}`}
//     />
// ))}



// {editedQuestion.type === "drag-and-drop" && (
//   <select
//     className="form-control mb-2"
//     value={editedQuestion.correctAnswer || ""}
//     onChange={(e) =>
//       setEditedQuestion({ ...editedQuestion, correctAnswer: e.target.value })
//     }
//   >
//     <option value="">Select Correct Match</option>
//     {editedQuestion.definitions?.map((definition, index) => (
//       <option key={index} value={definition.match}>
//         {definition.match} - {definition.text}
//       </option>
//     ))}
//   </select>
// )}





  
//         {Array.isArray(editedQuestion.options) &&
//           editedQuestion.options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               className="form-control mb-2"
//               value={option.text || ""}
//               onChange={(e) => handleOptionChange(e, index)}
//               placeholder={`Option ${String.fromCharCode(65 + index)}`}
//             />
//           ))}
  
//         <select
//           className="form-control mb-2"
//           value={editedQuestion.answer || ""}
//           onChange={handleCorrectAnswerChange}
//         >
//           <option value="">Select Correct Answer</option>
//           {Array.isArray(editedQuestion.options) &&
//             editedQuestion.options.map((_, index) => (
//               <option key={index} value={String.fromCharCode(65 + index)}>
//                 {String.fromCharCode(65 + index)}
//               </option>
//             ))}
//         </select>
  
//         <textarea
//           name="explanation"
//           className="form-control mb-2"
//           value={editedQuestion.explanation || ""}
//           onChange={handleEditChange}
//           placeholder="Explanation (optional)"
//         />
  
//         <button
//           className="btn btn-success me-2"
//           onClick={() => {
//             handleSave(editedQuestion);
//             setEditingQuestion(null);
//           }}
//         >
//           Save
//         </button>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setEditingQuestion(null)}
//         >
//           Cancel
//         </button>
//       </>
//     );
//   };
  
//   export default EditQuestion;
  


const EditQuestion = ({
    editedQuestion,
    setEditedQuestion,
    handleSave,
    setEditingQuestion,
  }) => {
    if (!editedQuestion) return null;
  
    // DEBUG
    console.log("🟡 editedQuestion object:", editedQuestion);
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditedQuestion({
        ...editedQuestion,
        [name]: name === "questionNumber" ? Number(value) || "" : value,
      });
    };
  
    const handleOptionChange = (e, index) => {
      const { value } = e.target;
      const updatedOptions = [...(editedQuestion.options || [])];
      updatedOptions[index] = { ...updatedOptions[index], text: value };
      setEditedQuestion({
        ...editedQuestion,
        options: updatedOptions,
      });
    };
  
    const handleCorrectAnswerChange = (e) => {
      const { value } = e.target;
      console.log("🟢 Selected Correct Answer:", value);
      setEditedQuestion({
        ...editedQuestion,
        answer: value,
      });
    };
  
    return (
      <>
        <input
          type="number"
          name="questionNumber"
          className="form-control mb-2"
          value={editedQuestion.questionNumber || ""}
          onChange={handleEditChange}
          placeholder="Question Number"
        />
        <input
          type="text"
          name="question"
          className="form-control mb-2"
          value={editedQuestion.question || ""}
          onChange={handleEditChange}
          placeholder="Enter Question"
        />
  
        {/* 🔵 Terms Debug */}
        {Array.isArray(editedQuestion.terms) &&
          editedQuestion.terms.map((term, index) => (
            <input
              key={`term-${index}`}
              type="text"
              className="form-control mb-2"
              value={term || ""}
              onChange={(e) => {
                const updatedTerms = [...editedQuestion.terms];
                updatedTerms[index] = e.target.value;
                console.log("🔵 Updated Terms:", updatedTerms);
                setEditedQuestion({ ...editedQuestion, terms: updatedTerms });
              }}
              placeholder={`Term ${index + 1}`}
            />
          ))}
  
        {/* 🔴 Definitions Debug */}
        {Array.isArray(editedQuestion.definitions) &&
          editedQuestion.definitions.map((definition, index) => (
            <input
              key={`definition-${index}`}
              type="text"
              className="form-control mb-2"
              value={definition.text || definition || ""}
              onChange={(e) => {
                const updatedDefinitions = [...editedQuestion.definitions];
                if (typeof updatedDefinitions[index] === "object") {
                  updatedDefinitions[index] = {
                    ...updatedDefinitions[index],
                    text: e.target.value,
                  };
                } else {
                  updatedDefinitions[index] = { text: e.target.value };
                }
                console.log("🔴 Updated Definitions:", updatedDefinitions);
                setEditedQuestion({
                  ...editedQuestion,
                  definitions: updatedDefinitions,
                });
              }}
              placeholder={`Definition ${index + 1}`}
            />
          ))}
  
        {/* 🟣 Drag-and-Drop Correct Answer */}
        {editedQuestion.type === "drag-and-drop" &&
  Array.isArray(editedQuestion.terms) &&
  editedQuestion.terms.map((term, index) => (
    <div key={`term-answer-${index}`} className="mb-2">
      <label><strong>{term}</strong> - Select Match</label>
      <select
        className="form-control"
        value={editedQuestion.answer?.[index] || ""}
        onChange={(e) => {
          const updatedAnswers = [...(editedQuestion.answer || [])];
          updatedAnswers[index] = e.target.value;
          setEditedQuestion({
            ...editedQuestion,
            answer: updatedAnswers,
          });
        }}
      >
        <option value="">Select Correct Match</option>
        {Array.isArray(editedQuestion.definitions) &&
          editedQuestion.definitions.map((definition, defIndex) => (
            <option key={defIndex} value={definition.match}>
              {definition.match} - {definition.text}
            </option>
          ))}
      </select>
    </div>
))}


  
        {/* 🟠 Multiple Choice Options */}
        {Array.isArray(editedQuestion.options) &&
          editedQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              value={option.text || ""}
              onChange={(e) => handleOptionChange(e, index)}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
            />
          ))}
  
        {/* Correct Answer for MCQ */}
        <select
          className="form-control mb-2"
          value={editedQuestion.answer || ""}
          onChange={handleCorrectAnswerChange}
        >
          <option value="">Select Correct Answer</option>
          {Array.isArray(editedQuestion.options) &&
            editedQuestion.options.map((_, index) => (
              <option key={index} value={String.fromCharCode(65 + index)}>
                {String.fromCharCode(65 + index)}
              </option>
            ))}
        </select>
  
        {/* Explanation */}
        <textarea
          name="explanation"
          className="form-control mb-2"
          value={editedQuestion.explanation || ""}
          onChange={handleEditChange}
          placeholder="Explanation (optional)"
        />
  
        <button
          className="btn btn-success me-2"
          onClick={() => {
            console.log("💾 Saving Edited Question:", editedQuestion);
            handleSave(editedQuestion);
            setEditingQuestion(null);
          }}
        >
          Save
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setEditingQuestion(null)}
        >
          Cancel
        </button>
      </>
    );
  };
  
  export default EditQuestion;
  