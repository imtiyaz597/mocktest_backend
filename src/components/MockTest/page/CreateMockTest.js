// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const CreateMockTest = () => {
//     const [mockTest, setMockTest] = useState({
//         title: "",
//         price: "",
//         isFree: false,
//         quizType: "online",
//         template: "General",
//         excelFile: null, // Base64 string
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setMockTest((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     // ✅ Fix: Proper File Upload Handling
//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => {
//                 setMockTest((prev) => ({ ...prev, excelFile: reader.result }));
//                 console.log("📂 Base64 File Uploaded:", reader.result); // Debugging
//             };
//             reader.onerror = (error) => {
//                 console.error("❌ Error reading file:", error);
//             };
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/mock-tests", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(mockTest),
//             });

//             if (response.ok) {
//                 setMockTest({
//                     title: "",
//                     price: "",
//                     isFree: false,
//                     quizType: "online",
//                     template: "General",
//                     excelFile: null,
//                 });
//                 navigate("/mock-tests");
//             } else {
//                 console.error("❌ Failed to create mock test");
//             }
//         } catch (error) {
//             console.error("❌ Error creating mock test:", error);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2>Create a New Mock Test</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label className="form-label">Title*</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         placeholder="Enter mock test title"
//                         value={mockTest.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Price</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="price"
//                         placeholder="Enter price"
//                         value={mockTest.price}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="isFree"
//                         checked={mockTest.isFree}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Make this a free mock test</label>
//                 </div>

//                 <h4>Quiz Type</h4>
//                 <div className="form-check">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="online"
//                         checked={mockTest.quizType === "online"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Online Quiz</label>
//                 </div>
//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="offline"
//                         checked={mockTest.quizType === "offline"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Offline Quiz</label>
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Upload Excel File</label>
//                     <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
//                 </div>

//                 <div className="d-flex gap-2">
//                     <button type="submit" className="btn btn-success">Create</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>Cancel</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateMockTest;



// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const CreateMockTest = () => {
//     const { user } = useContext(AuthContext); // Get user details
//     const navigate = useNavigate();


//     const [mockTest, setMockTest] = useState({
//         title: "",
//         price: "",
//         isFree: false,
//         quizType: "online",
//         template: "General",
//         excelFile: null, // Base64 string
//     });

//     // Restrict access - if not admin, redirect
//     if (!user || user.role !== "admin") {
//         navigate("/mock-tests");
//         return null; // Prevent further rendering
//     }

   

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setMockTest((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = () => {
//                 setMockTest((prev) => ({ ...prev, excelFile: reader.result }));
//                 console.log("📂 Base64 File Uploaded:", reader.result);
//             };
//             reader.onerror = (error) => {
//                 console.error("❌ Error reading file:", error);
//             };
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/mock-tests", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(mockTest),
//             });

//             if (response.ok) {
//                 setMockTest({
//                     title: "",
//                     price: "",
//                     isFree: false,
//                     quizType: "online",
//                     template: "General",
//                     excelFile: null,
//                 });
//                 navigate("/mock-tests");
//             } else {
//                 console.error("❌ Failed to create mock test");
//             }
//         } catch (error) {
//             console.error("❌ Error creating mock test:", error);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2>Create a New Mock Test</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label className="form-label">Title*</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         placeholder="Enter mock test title"
//                         value={mockTest.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Price</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="price"
//                         placeholder="Enter price"
//                         value={mockTest.price}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="isFree"
//                         checked={mockTest.isFree}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Make this a free mock test</label>
//                 </div>

//                 <h4>Quiz Type</h4>
//                 <div className="form-check">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="online"
//                         checked={mockTest.quizType === "online"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Online Quiz</label>
//                 </div>
//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="offline"
//                         checked={mockTest.quizType === "offline"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Offline Quiz</label>
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Upload Excel File</label>
//                     <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
//                 </div>

//                 <div className="d-flex gap-2">
//                     <button type="submit" className="btn btn-success">Create</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateMockTest;



// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import * as XLSX from "xlsx";

// const CreateMockTest = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [mockTest, setMockTest] = useState({
//         title: "",
//         price: "",
//         isFree: false,
//         quizType: "online",
//         template: "General",
//         excelFile: null,
//         questions: [], // Stores parsed questions
//     });

//     // Restrict access - if not admin, redirect
//     if (!user || user.role !== "admin") {
//         navigate("/mock-tests");
//         return null;
//     }

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setMockTest((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
    
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const base64String = event.target.result.split(",")[1]; // Get Base64 data
//             setMockTest((prev) => ({
//                 ...prev,
//                 excelFile: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
//             }));
//         };
//         reader.readAsDataURL(file); // Read file as Base64
//     };   

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         const formattedMockTest = {
//             title: mockTest.title.trim(),
//             price: mockTest.isFree ? 0 : Number(mockTest.price) || 0,
//             isFree: mockTest.isFree,
//             quizType: mockTest.quizType,
//             template: mockTest.template,
//             excelFile: mockTest.excelFile, // ✅ Send Base64 content
//             questions: JSON.stringify(mockTest.questions),
            
//         };
        

    
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/mock-tests", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formattedMockTest),
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Failed to create mock test");
//             }
    
//             navigate("/mock-tests");
//         } catch (error) {
//             console.error("❌ Error creating mock test:", error.message);
//         }
//     };
    
    
    
    
    
    
    
    

//     return (
//         <div className="container mt-5">
//             <h2>Create a New Mock Test</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label className="form-label">Title*</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         placeholder="Enter mock test title"
//                         value={mockTest.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Price</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="price"
//                         placeholder="Enter price"
//                         value={mockTest.price}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="isFree"
//                         checked={mockTest.isFree}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Make this a free mock test</label>
//                 </div>

//                 <h4>Quiz Type</h4>
//                 <div className="form-check">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="online"
//                         checked={mockTest.quizType === "online"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Online Quiz</label>
//                 </div>
//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="radio"
//                         name="quizType"
//                         value="offline"
//                         checked={mockTest.quizType === "offline"}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Offline Quiz</label>
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Upload Excel File</label>
//                     <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
//                 </div>

//                 {mockTest.questions.length > 0 && (
//                     <div className="mt-3">
//                         <h5>📌 Extracted Questions Preview:</h5>
//                         <ul className="list-group">
//                             {mockTest.questions.map((q, index) => (
//                                 <li key={index} className="list-group-item">
//                                     <strong>Q{index + 1}: {q.question}</strong>
//                                     <ul>
//                                         {q.options.map((opt, i) => (
//                                             <li key={i}><strong>{opt.option}:</strong> {opt.text}</li>
//                                         ))}
//                                     </ul>
//                                     <p><strong>Answer:</strong> {q.answer}</p>
//                                     <p><strong>Explanation:</strong> {q.explanation}</p>
//                                     <p><strong>Tags:</strong> {q.tags.join(", ")}</p>
//                                     <p><strong>Level:</strong> {q.level}</p>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 <div className="d-flex gap-2 mt-3">
//                     <button type="submit" className="btn btn-success">Create</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateMockTest;




import { useState,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as XLSX from "xlsx";

const CreateMockTest = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [mockTest, setMockTest] = useState({
        title: "",
        price: "",
        isFree: false,
        excelFile: null,
        questions: [], // Stores parsed questions
    });

    // Restrict access - if not admin, redirect
    useEffect(() => {
        if (user?.role?.toLowerCase() !== "admin") {
            console.log(user?.role?.toLowerCase())
            navigate("/mock-tests");
        }
    }, [user, navigate]);
    
    if (!user) {
        return <p>Loading...</p>; // or null
    }
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMockTest((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.log("No file selected");
            return;
        }
    
        // Validate file type
        if (
            file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            file.type !== "application/vnd.ms-excel"
        ) {
            alert("Please upload a valid Excel file.");
            return;
        }
    
        console.log("Selected file:", file); // Debug
    
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result.split(",")[1];
            console.log("Base64 data:", base64String); // Debug
    
            setMockTest((prev) => {
                const updatedState = {
                    ...prev,
                    excelFile: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
                };
                console.log("Updated state:", updatedState); // Debug
                return updatedState;
            });
        };
        reader.readAsDataURL(file);
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!mockTest.title.trim()) {
            alert("Please provide a valid title.");
            return;
        }
        if (!mockTest.isFree && !mockTest.price) {
            alert("Please provide a price for the mock test.");
            return;
        }
        if (!mockTest.excelFile) {
            alert("Please upload an Excel file.");
            return;
        }
    
        const formattedMockTest = {
            title: mockTest.title.trim(),
            price: mockTest.isFree ? 0 : Number(mockTest.price) || 0,
            isFree: mockTest.isFree,
            excelFile: mockTest.excelFile,
            questions: JSON.stringify(mockTest.questions),
        };
    
        try {
            console.log("📤 Sending request to backend...");
            const response = await fetch("http://localhost:5000/api/admin/mock-tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedMockTest),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Backend Error:", errorData);
                throw new Error(errorData.message || "Failed to create mock test");
            }
    
            const data = await response.json();
            console.log("✅ Mock test created:", data);
            navigate("/mock-tests");
        } catch (error) {
            console.error("❌ Error in fetch:", error.message);
            alert(`Error: ${error.message}`);
        }
    };
    
    
    
    
    
    
    
    
    
    
    

    return (
        <div className="container mt-5">
            <h2>Create a New Mock Test</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title*</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        placeholder="Enter mock test title"
                        value={mockTest.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        placeholder="Enter price"
                        value={mockTest.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="isFree"
                        checked={mockTest.isFree}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Make this a free mock test</label>
                </div>

                
                <div className="mb-3">
                    <label className="form-label">Upload Excel File</label>
                    <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </div>

                {mockTest.questions.length > 0 && (
                    <div className="mt-3">
                        <h5>📌 Extracted Questions Preview:</h5>
                        <ul className="list-group">
                            {mockTest.questions.map((q, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>Q{index + 1}: {q.question}</strong>
                                    <ul>
                                        {q.options.map((opt, i) => (
                                            <li key={i}><strong>{opt.option}:</strong> {opt.text}</li>
                                        ))}
                                    </ul>
                                    <p><strong>Answer:</strong> {q.answer}</p>
                                    <p><strong>Explanation:</strong> {q.explanation}</p>
                                    <p><strong>Tags:</strong> {q.tags.join(", ")}</p>
                                    <p><strong>Level:</strong> {q.level}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-success">Create</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateMockTest;
