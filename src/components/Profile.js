// import React, {useState} from "react";
//Set the contactDetail here as profile 
//and then provide the an alternative to save as profile
function Profile({updateUser, updateImage}) {
	// const [user, setUser] = useState({
	// 	id: "",
	// 	name: "",
	// 	email: "",
	// 	password: "",
	// 	electionParticipation: false,
	// 	votes: 0,
	// 	photoUrl: "",
	// });



	return (
		<header className="header">
			<div className="container">
				<h1>profile</h1>
				<button className="btn">
					<i className="bi bi-plus-square"></i> Enter Election
				</button>
			</div>
		</header>
	);
}

export default Profile;
