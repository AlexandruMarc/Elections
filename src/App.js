import { useState, useEffect, useRef } from "react";
import "./App.css";
import { getAllCandidates, getAllUsers, saveUser, getUser, updatePhoto } from "./api/ElectionService";
import Profile from "./components/Profile";
import Header from "./components/Header";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Participants from "./components/Participants";

function App() {
	const navigate = useNavigate(); // useNavigate hook pentru navigare
	const fileRef = useRef();
	const dialogRef = useRef();
	const [electionParticipation, setElectionParticipation] = useState(() => {
		const savedStatus = localStorage.getItem("electionParticipation");
		return savedStatus === "false";
	});
	const [data, setData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [usersData, setUsersData] = useState({});
	const [userData, setUserData] = useState({
		id: "",
	});
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

	const getUsers = async (page = 0, size = 4) => {
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
	};

	const handleRegister = async (event) => {
		event.preventDefault();
		try {
			const { data: userData } = await saveUser(values);

			const formData = new FormData();
			formData.append("file", file, file.name);
			formData.append("id", userData.id);

			// Închide dialogul
			dialogRef.current.close();

			// Actualizează starea cu datele utilizatorului
			setUserData(userData);

			// Salvează ID-ul utilizatorului în localStorage
			localStorage.setItem("userId", userData.id);

			// Redirecționează către profilul utilizatorului
			navigate(`/elections/${userData.id}`);
		} catch (error) {
			console.error("Error registering user", error);
		}
	};

	//Implement the logout method
	// const handleLogout = () => {
	// 	// Șterge ID-ul utilizatorului din localStorage
	// 	localStorage.removeItem("userId");

	// 	// Resetează starea aplicației
	// 	setUserData({
	// 		id: ""
	// 	});

	// 	// Opțional, redirecționează către pagina de login sau home
	// 	navigate("/login");
	// };

	const handleToggleParticipation = async (value) => {
		const storedUserId = localStorage.getItem("userId");
		const { data } = await getUser(storedUserId);
		console.log(data);
		data.electionParticipation = value;
		await saveUser(data);
		toggleParticipation(value);
	};

	const toggleParticipation = (status) => {
		setElectionParticipation(status);
		localStorage.setItem("electionParticipation", status);
	};

	const updateUser = async (user) => {
		try {
			const { data } = await saveUser(user);
			console.log(data);
		} catch (error) {
			console.error("Error updating contact:", error);
			//toastError(error.messages);
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

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");

		if (storedUserId) {
			// Dacă există un ID salvat în localStorage, îl setăm în state
			setUserData((prevData) => ({ ...prevData, id: storedUserId }));
		} else {
			// Dacă nu există ID, afișăm dialogul de înregistrare
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

			<Header userData={userData.id} electionParticipation={electionParticipation} toggleParticipation={handleToggleParticipation} numberOfParticipants={data.totalElements} />

			<main className="main">
				<div className="container">
					<Routes>
						<Route path="/" element={<Navigate to={"/elections"} />} />
						<Route path="/elections/candidates" element={<Participants data={data} currentPage={currentPage} getAllCandidates={getCandidates} />} />
						<Route path="/elections/users" element={<Participants data={usersData} currentPage={currentPage} getAllCandidates={getUsers} />} />
						<Route path="/elections/profile/:id" element={<Profile updateUser={updateUser} updateImage={updateImage} />} />
					</Routes>
				</div>
			</main>
		</>
	);
}

export default App;
