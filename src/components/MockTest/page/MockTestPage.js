import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "../MockTestPage.css"

const MockTests = () => {
    const { user } = useContext(AuthContext); // Get user details
    const [mockTestsData, setMockTestsData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMockTests();
    }, []);

    const fetchMockTests = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/mock-tests`);
            if (response.ok) {
                const data = await response.json();
                setMockTestsData(data);
            } else {
                console.error("Failed to fetch mock tests");
            }
        } catch (error) {
            console.error("Error fetching mock tests:", error);
        }
    };

    return (
        <div className="container mt-4">
            {/* 🔙 Back Button */}
            <button className="back-btn-custom mb-3" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1 className="text-2xl font-bold mb-4">Available Mock Tests</h1>

            {/* ✅ 'Create Mock' button (admin-only) */}
            {user?.role?.toLowerCase() === "admin" && (
                <button className="btn btn-success mb-3" onClick={() => navigate("/create-mock-test")}>
                    Create Mock
                </button>
            )}

            {mockTestsData.length === 0 ? (
                <p>No mock tests available.</p>
            ) : (
                <div className="row">
                    {mockTestsData.map((test) => (
                        <div key={test._id} className="col-md-4">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{test.title}</h5>
                                    <p className="card-text">{test.isFree ? "Free" : `Price: ₹${test.price}`}</p>

                                    {/* ✅ 'Start Test' button (user-only) */}
                                    {user?.role.toLowerCase() === "student" && (
                                        <button className="btn btn-primary" onClick={() => navigate(`/exam/${test._id}`)}>
                                            Start Test
                                        </button>
                                    )}

                                    {/* ✅ 'Edit Test' button (admin-only) */}
                                    {user?.role?.toLowerCase() === "admin" && (
                                        <button className="btn btn-warning ms-2" onClick={() => navigate(`/exam/${test._id}`)}>
                                            Edit Test
                                        </button>
                                    )}
                                    {user?.role?.toLowerCase() === "teacher" && (
                                        <button className="btn btn-warning ms-2" onClick={() => navigate(`/exam/${test._id}`)}>
                                            Edit Test
                                        </button>
                                    )}
                                    {user?.role?.toLowerCase() === "management" && (
                                        <button className="btn btn-warning ms-2" onClick={() => navigate(`/exam/${test._id}`)}>
                                            Edit Test
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MockTests;
