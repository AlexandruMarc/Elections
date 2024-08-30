import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getAllCandidates, getAllUsers, saveUser, getUser, updatePhoto } from "./api/ElectionService";
import Profile from "./components/user/Profile";
import Header from "./components/header/Header";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Participants from "./components/candidates/Participants";
import UserDetail from "./components/user/UserDetail";
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import { toastSuccess, toastError } from "./api/ToastService";

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const [electionParticipation, setElectionParticipation] = useState(() => {
		const savedStatus = localStorage.getItem("electionParticipation");
		return savedStatus === "false";
	});
	const [data, setData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [usersData, setUsersData] = useState({});

	//Collects all the participants in the election
	const getCandidates = async (page = 0, size = 5) => {
		try {
			setCurrentPage(page);
			const { data } = await getAllCandidates(page, size);
			setData(data);
			//console.log("doar candidati", data);
		} catch (error) {
			console.log(error);
		}
	};

	//Collects all the users in the database
	const getUsers = async (page = 0, size = 4) => {
		try {
			setCurrentPage(page);
			const { data } = await getAllUsers(page, size);
			setUsersData(data);
			//console.log("toti useri", data);
		} catch (error) {
			console.log(error);
		}
	};

	//Handles the participation
	const handleToggleParticipation = async (value) => {
		const storedUserId = localStorage.getItem("userId");
		const { data } = await getUser(storedUserId);
		console.log(data);
		data.electionParticipation = value;
		await saveUser(data);
		toggleParticipation(value);
		toastSuccess("The participation in the voting has been updated!");
	};

	const toggleParticipation = (status) => {
		setElectionParticipation(status);
		localStorage.setItem("electionParticipation", status);
	};

	//Updates the user
	const updateUser = async (user) => {
		try {
			await saveUser(user);
		} catch (error) {
			console.error("Error updating contact:", error);
			toastError(error.messages);
		}
	};

	const updateImage = async (formData) => {
		try {
			// eslint-disable-next-line no-unused-vars
			const { data: photoUrl } = await updatePhoto(formData);
		} catch (error) {
			console.error("Error updating image:", error);
		}
	};

	const userFromLocalStorage = localStorage.getItem("userId");

	useEffect(() => {
		// Redirects users to the login or register page if they are not logged in and are trying to access other pages (e.g., candidates, users, etc.)
		if (!userFromLocalStorage) {
			if (location.pathname !== "/elections/register" && location.pathname !== "/elections/login") {
				navigate("/elections/register");
			}
		} else {
			if (location.pathname === "/elections/register" || location.pathname === "/elections/login") {
				navigate("/elections/candidates");
			}
		}
		getCandidates();
		getUsers();
	}, [userFromLocalStorage, location.pathname, navigate]);

	return (
		<>
			{/* Display the header only if you are not on the login or register page */}
			{location.pathname !== "/elections/login" && location.pathname !== "/elections/register" && <Header userData={userFromLocalStorage} electionParticipation={electionParticipation} toggleParticipation={handleToggleParticipation} numberOfParticipants={data.totalElements} />}
			<ToastContainer />
			<main className="main">
				<div className="container">
					<Routes>
						<Route path="/" element={<Navigate to={"/elections"} />} />
						<Route path="/elections" element={<Navigate to={"/elections/candidates"} />} />
						<Route path="/elections/register" element={<Register />} />
						<Route path="/elections/login" element={<Login />} />
						<Route path="/elections/candidates" element={<Participants data={data} currentPage={currentPage} getAllCandidates={getCandidates} />} />
						<Route path="/elections/users" element={<Participants data={usersData} currentPage={currentPage} getAllCandidates={getUsers} />} />
						<Route path="/elections/:id" element={<UserDetail />} />
						<Route path="/elections/profile/:id" element={<Profile updateUser={updateUser} updateImage={updateImage} />} />
					</Routes>
				</div>
			</main>
		</>
	);
}

export default App;
