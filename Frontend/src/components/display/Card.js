import React from "react";
import { Link } from "react-router-dom";

function Card({ user }) {
	return (
		<Link to={`/elections/${user.id}`} className="user__item">
			<div className="user__header">
				<div className="user__image">
					<img src={user.photoUrl} alt={user.name} />
				</div>
				<div className="user__details">
					<p className="user__name">{user.name}</p>
				</div>
			</div>
			<div className="user__body">
				<p><i className="bi bi-envelope"></i> {user.email}</p>
				<p><i className="bi bi-body-text"></i> {user.description ? user.description.substring(0, 150) : ""}</p>
				<p><i className="bi bi-hand-thumbs-up"></i> {user.votes}</p>
				<p>{user.electionParticipation === true ? <i className="bi bi-check-circle"></i> 
						: <i className="bi bi-x-circle"></i>} {user.electionParticipation ? "Candidate" : "User"}</p>
			</div>
		</Link>
	);
}

export default Card;
