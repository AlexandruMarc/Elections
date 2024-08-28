import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userData, electionParticipation, toggleParticipation, numberOfParticipants }) => {
	return (
		<header className="header">
			<div className="container">
				<Link to="/elections/candidates">
					<h3>Participants ({numberOfParticipants})</h3>
				</Link>
				<Link to="/elections/users" className="btn">
					All Users
				</Link>
				{electionParticipation ? (
					<button onClick={() => toggleParticipation(true)} className="btn">
						<i className="bi bi-plus-square"></i> Enter Election
					</button>
				) : (
					<button onClick={() => toggleParticipation(false)} className="btn">
						<i className="bi bi-dash-square"></i> Leave Election
					</button>
				)}
				<Link to={`/elections/profile/${userData}`} className="btn">
					<i className="bi bi-person-circle"></i> Profile
				</Link>
			</div>
		</header>
	);
};

export default Header;
