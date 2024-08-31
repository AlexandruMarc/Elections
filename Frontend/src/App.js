import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Profile from "./components/user/Profile";
import Header from "./components/header/Header";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import UserDetail from "./components/user/UserDetail";
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import DisplaingUsers from "./components/display/DisplaingUsers";

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const userFromLocalStorage = localStorage.getItem("userId");

	const isAuthPage = location.pathname === "/elections/register" || location.pathname === "/elections/login";

	useEffect(() => {
		// Redirect users based on their login status and current route
		if (!userFromLocalStorage && !isAuthPage) {
			navigate("/elections/register");
		} else if (userFromLocalStorage && isAuthPage) {
			navigate("/elections/candidates");
		}
	}, [userFromLocalStorage, isAuthPage, navigate]);

	return (
		<>
			{/* Display the header only if not on the login or register page */}
			{!isAuthPage && <Header />}
			<ToastContainer />
			<main className="main">
				<div className="container">
					<Routes>
						<Route path="/" element={<Navigate to="/elections" />} />
						<Route path="/elections" element={<Navigate to="/elections/candidates" />} />
						<Route path="/elections/register" element={<Register />} />
						<Route path="/elections/login" element={<Login />} />
						<Route path="/elections/candidates" element={<DisplaingUsers />} />
						<Route path="/elections/users" element={<DisplaingUsers />} />
						<Route path="/elections/:id" element={<UserDetail />} />
						<Route path="/elections/profile/:id" element={<Profile />} />
					</Routes>
				</div>
			</main>
		</>
	);
}

export default App;
