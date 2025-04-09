// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true); // For loading state
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (token) {
//           const userData = JSON.parse(atob(token.split(".")[1])); // Decode the JWT to get user details
//           setUser(userData);
//         }
//       }, []);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const userRole = localStorage.getItem("role");

       

//         console.log("Token in localStorage:", token);
//         console.log("Role in localStorage:", userRole);

//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);

//                 // Check if the token is expired
//                 if (decodedToken.exp * 1000 < Date.now()) {
//                     console.log("Token expired, logging out.");
//                     logout(); // Call the logout function if token is expired
//                 } else {
//                     setUser({ role: userRole }); // Set the user if the token is valid
//                 }
//             } catch (error) {
//                 console.log("Invalid token, logging out.");
//                 logout(); // Handle invalid tokens by logging out
//             }
//         }

//         setIsLoading(false); // Set loading to false after checking
//     }, []);

//     const login = (token, role) => {
//         localStorage.setItem("token", token);
//         localStorage.setItem("role", role);
//         setUser({ role });
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         setUser(null);
//         navigate("/signin");
//     };

//     if (isLoading) return <div>Loading...</div>; // Show a loading indicator while checking auth state

//     return (
//         <AuthContext.Provider value={{ user,setUser, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthProvider;



// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode"; // Correctly import jwt-decode

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 console.log("Decoded Token:", decodedToken); // Debug the token
//                 // Check if the token is expired
//                 if (decodedToken.exp * 1000 < Date.now()) {
//                     console.log("Token expired. Logging out...");
//                     logout();
//                 } else {
//                     // Set user role from token
//                     setUser({ role: decodedToken.role });
//                 }
//             } catch (error) {
//                 console.error("Invalid token. Logging out...");
//                 logout();
//             }
//         }

//         setIsLoading(false); // Loading is done
//     }, []);

//     const login = (token) => {
//         try {
//             const decodedToken = jwtDecode(token);
//             localStorage.setItem("token", token);
//             setUser({ role: decodedToken.role }); // Decode role from token
//         } catch (error) {
//             console.error("Invalid token provided during login.");
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         setUser(null);
//         navigate("/signin");
//     };

//     if (isLoading) return <div>Loading...</div>; // Show a loading indicator while checking auth state

//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthProvider;


import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correctly import jwt-decode

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("Token expired. Logging out...");
                    logout();
                } else {
                    setUser({
                        id: decodedToken.id,
                        name: decodedToken.name,
                        role: decodedToken.role,
                    });
                    
                }
            } catch (error) {
                console.error("Invalid token. Logging out...");
                logout();
            }
        }
       


        setIsLoading(false);
    }, []);

    const login = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            localStorage.setItem("token", token);
            setUser({
                id: decodedToken.id,
                name: decodedToken.name, // Include name
                role: decodedToken.role
            });
        } catch (error) {
            console.error("Invalid token provided during login.");
        }
    };
    

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/signin");
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
