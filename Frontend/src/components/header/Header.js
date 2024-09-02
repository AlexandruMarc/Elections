import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCandidates, getUser, saveUser } from "../../utils/ElectionService";
import { toastSuccess } from "../../utils/ToastService";

function Header() {
	const [electionParticipation, setElectionParticipation] = useState(() => {
		const savedStatus = localStorage.getItem("electionParticipation");
		return savedStatus === "false";
	});
	const [data, setData] = useState({});

	async function getNrOfParticipants(page = 0, size = 5) {
		const { data: participants } = await getAllCandidates(page, size);
		setData(participants);
	}

	const userData = localStorage.getItem("userId");

	//Handles the participation
	async function handleToggleParticipation(value) {
		const storedUserId = localStorage.getItem("userId");
		const { data } = await getUser(storedUserId);
		console.log(data);
		data.electionParticipation = value;
		await saveUser(data);
		toggleParticipation(value);
		toastSuccess("The participation in the voting has been updated!");
	}

	function toggleParticipation(status) {
		setElectionParticipation(status);
		localStorage.setItem("electionParticipation", status);
	}

	useEffect(() => {
		getNrOfParticipants();
	}, []);

	return (
		<header className="header">
			<div className="container">
				<Link to="/elections/candidates" className="link">
					<h3>Participants ({data.totalElements})</h3>
				</Link>
				<Link to="/elections/users" className="btn">
					All Users
				</Link>
				{electionParticipation ? (
					<button onClick={() => handleToggleParticipation(true)} className="btn">
						<i className="bi bi-plus-square"></i> Enter Election
					</button>
				) : (
					<button onClick={() => handleToggleParticipation(false)} className="btn">
						<i className="bi bi-dash-square"></i> Leave Election
					</button>
				)}
				<Link to={`/elections/profile/${userData}`} className="btn">
					<i className="bi bi-person-circle"></i> Profile
				</Link>
			</div>
		</header>
	);
}

export default Header;
