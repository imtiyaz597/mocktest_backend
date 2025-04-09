// import React, { useContext, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import QuestionOptions from "./QuestionOptions";
// import EditQuestion from "./EditQuestion";

// const QuestionCard = ({
//   currentQuestion = {},
//   currentQuestionIndex = 0,
//   isEditing = false,
//   editedQuestion,
//   setEditedQuestion = () => {},
//   answers = {},
//   handleAnswerSelect = () => {},
//   handleEdit = () => {},
//   handleSave = () => {},
//   setEditingQuestionId = () => {},
//   showResults = false,
// }) => {
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     console.log("🔍 Rendering QuestionCard...");
//     console.log("📌 currentQuestionIndex:", currentQuestionIndex);
//     console.log("🧠 currentQuestion:", currentQuestion);
//     console.log("✏️ isEditing:", isEditing);
//     console.log("📝 editedQuestion:", editedQuestion);
//     console.log("👤 userRole:", user?.role);
//   }, [currentQuestion, currentQuestionIndex, isEditing, editedQuestion, user]);

//   return (
//     <div className="card border-primary">
//       <div className="card-body">
//         <p>
//           <strong>Question Type:</strong>{" "}
//           {currentQuestion.questionType || "Single-Select"}
//         </p>

//         {showResults && (
//           <p>
//             <strong>Explanation:</strong>{" "}
//             {currentQuestion.explanation || "No Explanation Provided"}
//           </p>
//         )}

//         {user?.role?.toLowerCase() === "admin" && (
//           <>
//             <p>
//               <strong>Tags:</strong>{" "}
//               {currentQuestion.tags?.length
//                 ? currentQuestion.tags.join(", ")
//                 : "No Tags"}
//             </p>
//             <p>
//               <strong>Difficulty Level:</strong>{" "}
//               {currentQuestion.level || "Medium"}
//             </p>
//           </>
//         )}

//         <p>
//           <strong>Marks:</strong> {currentQuestion.marks || 0}
//         </p>
//         <p>
//           <strong>Time:</strong> {currentQuestion.time || 0} minutes
//         </p>

//         {isEditing && editedQuestion ? (
//           <EditQuestion
//             editedQuestion={editedQuestion}
//             setEditedQuestion={setEditedQuestion}
//             handleSave={handleSave}
//             setEditingQuestion={setEditingQuestionId}
//           />
//         ) : (
//           <>
//             <p>
//               {currentQuestionIndex + 1}. {currentQuestion.question}
//             </p>
//             <QuestionOptions
//               currentQuestion={currentQuestion}
//               answers={answers}
//               handleAnswerSelect={handleAnswerSelect}
//             />
//             {user?.role?.toLowerCase() === "admin" && (
//               <button
//                 className="btn btn-warning mt-3"
//                 onClick={() => {
//                   console.log("🔧 Edit button clicked");
//                   handleEdit();
//                 }}
//               >
//                 Edit
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;



import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import QuestionOptions from "./QuestionOptions";
import EditQuestion from "./EditQuestion";

const QuestionCard = ({
  currentQuestion = {},
  currentQuestionIndex = 0,
  isEditing = false,
  editedQuestion,
  editedQuestions = {}, // ✅ Add this
  setEditedQuestions = () => {}, // ✅ Add this
  setEditedQuestion = () => {},
  answers = {},
  handleAnswerSelect = () => {},
  handleEdit = () => {},
  handleSave = () => {},
  setEditingQuestionId = () => {},
  showResults = false,
}) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("🔍 Rendering QuestionCard...");
    console.log("📌 currentQuestionIndex:", currentQuestionIndex);
    console.log("🧠 currentQuestion:", currentQuestion);
    console.log("✏️ isEditing:", isEditing);
    console.log("📝 editedQuestion:", editedQuestion);
    console.log("👤 userRole:", user?.role);
  }, [currentQuestion, currentQuestionIndex, isEditing, editedQuestion, user]);

  return (
    <div className="card border-primary">
      <div className="card-body">
        <p>
          <strong>Question Type:</strong>{" "}
          {currentQuestion.questionType || "Single-Select"}
        </p>

        {showResults && (
          <p>
            <strong>Explanation:</strong>{" "}
            {currentQuestion.explanation || "No Explanation Provided"}
          </p>
        )}

        {["admin", "teacher", "management"].includes(user?.role?.toLowerCase())  && (
          <>
            <p>
              <strong>Tags:</strong>{" "}
              {currentQuestion.tags?.length
                ? currentQuestion.tags.join(", ")
                : "No Tags"}
            </p>
            <p>
              <strong>Difficulty Level:</strong>{" "}
              {currentQuestion.level || "Medium"}
            </p>
          </>
        )}

        <p>
          <strong>Marks:</strong> {currentQuestion.marks || 0}
        </p>
        <p>
          <strong>Time:</strong> {currentQuestion.time || 0} minutes
        </p>

        {isEditing && editedQuestion ? (
          <EditQuestion
            editedQuestion={editedQuestion}
            setEditedQuestion={setEditedQuestion}
            handleSave={handleSave}
            setEditingQuestion={setEditingQuestionId}
          />
        ) : (
          <>
            <p>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </p>
            <QuestionOptions
              currentQuestion={currentQuestion}
              answers={answers}
              handleAnswerSelect={handleAnswerSelect}
              isEditing={isEditing}
              editedQuestion={editedQuestions[currentQuestion._id]} // ✅ FIXED
              setEditedQuestion={(updatedData) =>
                setEditedQuestions((prev) => ({
                  ...prev,
                  [currentQuestion._id]: {
                    ...prev[currentQuestion._id],
                    ...updatedData,
                  },
                }))
              }
            />
            {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
              <button
                className="btn btn-warning mt-3"
                onClick={() => {
                  console.log("🔧 Edit button clicked");
                  handleEdit();
                }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
