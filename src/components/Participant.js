import React from "react";

import { Link } from "react-router-dom";

function Participant({ user }) {
	return (
		<Link to={`/elections/${user.id}`} className="contact__item">
			<div className="contact__header">
				<div className="contact__image">
					<img src={user.photoUrl} alt={user.name} />
				</div>
				<div className="contact__details">
					<p className="contact_name">{user.name}</p>
				</div>
			</div>
			<div className="contact__body">
				<p>
					<i className="bi bi-envelope"></i> {user.email}
				</p>
				<p>
					<i className="bi bi-body-text"></i> {user.description ? user.description.substring(0, 150) : ""}
				</p>
				<p>
					<i className="bi bi-hand-thumbs-up"></i> {user.votes}
				</p>
				<p>{user.electionParticipation === true ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>} Candidate</p>
			</div>
		</Link>
	);
}

export default Participant;
