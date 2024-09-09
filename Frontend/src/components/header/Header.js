/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../utils/ElectionService";

function Header({ totalParticipants, onParticipationChange }) {
	const [userParticipation, setUserParticipation] = useState(null);
	const userData = localStorage.getItem("userId");

	//Function to get user data from the backend on component load
	async function fetchUserParticipation() {
		try {
			const { data } = await getUser(userData);
			setUserParticipation(data.electionParticipation);
		} catch (error) {
			console.log("Error fetching user data", error);
		}
	}

	useEffect(() => {
		fetchUserParticipation();
	}, [userData]);

	// Function that handles participation changes
	async function handleToggleParticipation(value) {
		await onParticipationChange(value);
		setUserParticipation(value);
	}

	return (
		<header className="header">
			<div className="container">
				{totalParticipants ? (
					<Link to="/elections/candidates" className="link">
						<h3>
							Participants{" "}
							<i className="bi bi-arrow-right-circle-fill"></i>
							{totalParticipants}
						</h3>
					</Link>
				) : (
					<Link to="/elections/candidates" className="link">
						<h3>
							<i className="bi bi-arrow-left-circle-fill"></i>
							Participants
						</h3>
					</Link>
				)}
				<Link to="/elections/users" className="btn">
					All Users
				</Link>

				{userParticipation !== null && onParticipationChange && (
					<>
						{userParticipation ? (
							<button
								onClick={() => handleToggleParticipation(false)}
								className="btn"
							>
								<i className="bi bi-dash-square"></i> Leave
								Election
							</button>
						) : (
							<button
								onClick={() => handleToggleParticipation(true)}
								className="btn"
							>
								<i className="bi bi-plus-square"></i> Enter
								Election
							</button>
						)}
					</>
				)}

				<Link to={`/elections/profile/${userData}`} className="btn">
					<i className="bi bi-person-circle"></i> Profile
				</Link>
			</div>
		</header>
	);
}

export default Header;
