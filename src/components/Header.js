import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userData, toggleParticipation, numberOfParticipants }) => {
	return (
		<header className="header">
			<div className="container">
				<Link to="/elections">
					<h3>Participants ({numberOfParticipants})</h3>
				</Link>
				<Link to="/elections/users" className="btn">
					All Users
				</Link>
				<button onClick={toggleParticipation} className="btn">
					<i className="bi bi-plus-square"></i> Enter Election
				</button>
				<Link to={`/elections/${userData}`} className="btn">
					<i className="bi bi-person-circle"></i> Profile
				</Link>
			</div>
		</header>
	);
};

export default Header;
