import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MockSidebar from "./MockSidebar";

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="d-flex vh-100">
            {/* Sidebar */}
            <MockSidebar />

            {/* Main Content */}
            <div className="container mt-5 text-center" style={{ marginLeft: "250px" }}>
                <h1>User Dashboard</h1>
                <p>Welcome, {user?.name || "User"}! You can access your personal content here.</p>

                {/* Navigation Button */}
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/mock-tests")}
                >
                    View Available Mock Tests
                </button>

                {/* Logout Button */}
                <button className="btn btn-danger mt-3" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
