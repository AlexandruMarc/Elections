import { useState, useEffect, useRef } from "react";
import "./App.css";
import { getAllCandidates, getAllUsers, saveUser } from "./api/ElectionService";
import Profile from "./components/Profile";
import Header from "./components/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Participants from "./components/Participants";

function App() {
	const fileRef = useRef();
  const dialogRef = useRef();
	const [data, setData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [usersData, setUsersData] = useState({});
  const [userData, setUserData] = useState(null);
	const [file, setFile] = useState(undefined);
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		photo: "",
	});

	const getCandidates = async (page = 0, size = 10) => {
		try {
			setCurrentPage(page);
			const { data } = await getAllCandidates(page, size);
			setData(data);
			console.log("doar candidati", data);
		} catch (error) {
			console.log(error);
		}
	};
	const getUsers = async (page = 0, size = 10) => {
		try {
			setCurrentPage(page);
			const { data } = await getAllUsers(page, size);
			setUsersData(data);
			console.log("toti useri", data);
		} catch (error) {
			console.log(error);
		}
	};

	const onChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
		//console.log("File: App.js", "Line 36:", values);
	};

	const handleRegister = async (event) => {
		event.preventDefault();
		try {
			const { data } = await saveUser(values);
      setUserData(data);
			const formData = new FormData();
			formData.append("file", file, file.name);
			formData.append("id", data.id);
			console.log("User registered successfully", data);
			document.getElementById("modal").close();
		} catch (error) {
			console.error("Error registering user", error);
		}
	};

  const handleToggleParticipation = (userId) => userId.electionParticipation = true;


	useEffect(() => {
    if (dialogRef.current) {
			dialogRef.current.showModal();
		}
		getCandidates();
		getUsers();
	}, []);

	return (
		<>
			{/* Modal */}
			<dialog ref={dialogRef} className="modal" id="modal">
				<div className="modal__header">
					<h3>Register</h3>
				</div>
				<div className="divider"></div>
				<div className="modal__body">
					<form onSubmit={handleRegister}>
						<div className="user-details">
							<div className="input-box">
								<span className="details">Name</span>
								<input type="text" value={values.name} onChange={onChange} name="name" required />
							</div>
							<div className="input-box">
								<span className="details">Email</span>
								<input type="email" value={values.email} onChange={onChange} name="email" required />
							</div>
							<div className="input-box">
								<span className="details">Password</span>
								<input type="password" value={values.password} onChange={onChange} name="password" required />
							</div>
							<div className="file-input">
								<span className="details">Profile Photo</span>
								<input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name="photo" required />
							</div>
						</div>
						<div className="form_footer">
							<button type="submit" className="btn">
								Submit
							</button>
						</div>
					</form>
				</div>
			</dialog>
			{/* Vreau nu sa transmit toaa data de la users ci de la unul specific adica cel de la profilul meu */}
			<Header toggleParticipation={() => handleToggleParticipation(userData.id)} numberOfParticipants={data.totalElements} />
			<main className="main">
				<div className="container">
					<Routes>
						<Route path="/" element={<Navigate to={"/elections"} />} />
						<Route path="/elections" element={<Participants data={data} currentPage={currentPage} getAllCandidates={getCandidates} />} />
						<Route path="/elections/users" element={<Participants data={usersData} currentPage={currentPage} getAllCandidates={getUsers} />} />
						<Route path="/elections/profile" element={<Profile />} />
					</Routes>
				</div>
			</main>
		</>
	);
}

export default App;
