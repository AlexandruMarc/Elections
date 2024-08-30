import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../api/ElectionService";
import { toastSuccess } from "../../api/ToastService";

function UserDetail() {
	const [user, setUser] = useState({
		name: "",
		email: "",
		description: "",
		electionParticipation: false,
		votes: 0,
		photoUrl: "",
	});

	const { id } = useParams();

	const fetchUser = async (id) => {
		try {
			const { data } = await getUser(id);
			setUser(data);
			//console.log("Line 22: from UserDetail -> ","User retrieved successfully", data);
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	//For handling user vote that he cannot vote more than once
	const userId = localStorage.getItem("userId");
	const likedKey = `liked_${userId}_${id}`;
	const [hasLiked, setHasLiked] = useState(false);

	const handleLike = () => {
		if (!hasLiked) {
			localStorage.setItem(likedKey, "true");
			setHasLiked(true);
		}
	};

	const onClick = async (event) => {
		event.preventDefault();
		setUser((prev) => ({ ...prev }));
		user.votes += 1;
		await updateUser(user);
		fetchUser(id);
		handleLike();
		toastSuccess("Succesfully voted for -> " + user.name);
	};

	useEffect(() => {
		// checks if user already voted for this candidate
		if (localStorage.getItem(likedKey)) {
			setHasLiked(true);
		}

		fetchUser(id);
	}, [likedKey, id]);

	return (
		<>
			<div className="profile">
				<div className="profile__details">
					<img src={user.photoUrl} alt={`Profile of ${user.name}`} />
					<div className="profile__metadata">
						<p className="profile__name">{user.name}</p>
					</div>
				</div>
				<div className="profile__settings">
					<div>
						<form className="form">
							<div className="user-details">
								<input type="hidden" defaultValue={user.id} name="id" readOnly />
								<div className="input-box">
									<span className="details">Name</span>
									<input type="text" value={user.name} name="name" readOnly />
								</div>
								<div className="input-box">
									<span className="details">Email</span>
									<input type="text" value={user.email} name="email" readOnly />
								</div>
								<div className="input-box">
									<span className="details">Votes</span>
									<input type="text" value={user.votes} name="votes" readOnly />
									<button className="btn" style={{ marginTop: "10px" }} onClick={onClick} disabled={hasLiked}>
										{hasLiked ? "Voted" : "Vote"}
									</button>
								</div>
								<div className="input-box">
									<span className="details">Election Participation</span>
									<input type="text" value={user.electionParticipation ? "candidate" : "User"} name="status" readOnly />
								</div>
								<div className="input-box">
									<span className="details">Description</span>
									<textarea
										value={user.description || ""}
										name="description"
										style={{
											width: "100%",
											height: "150px",
											padding: "10px",
											fontSize: "16px",
											borderRadius: "5px",
											border: "1px solid #ccc",
											backgroundColor: "#f9f9f9",
											resize: "none",
											outline: "none",
										}}
										readOnly></textarea>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserDetail;
