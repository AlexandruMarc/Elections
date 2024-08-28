import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { getUserProfile } from "../api/ElectionService";
//Set the userDetail here as profile
//and then provide the an alternative to save as profile
function Profile({ updateUser, updateImage }) {
	const inputRef = useRef();
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		description: "",
		electionParticipation: false,
		votes: 0,
		photoUrl: "",
	});

	const { id } = useParams();
	const fetchUser = async (id) => {
		try {
			const { data } = await getUserProfile(id);
			setUser(data);
			console.log("User retrieved successfully", data);
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	const selectImage = () => {
		inputRef.current.click();
	};

	const onChange = (event) => {
		setUser({ ...user, [event.target.name]: event.target.value });
		//console.log("File: App.js", "Line 36:", values);
	};

	const updatePhoto = async (file) => {
		try {
			const formData = new FormData();
			formData.append("file", file, file.name);
			formData.append("id", id);
			await updateImage(formData);
			setUser((prev) => ({
				...prev,
				photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`,
			}));
			//toastSuccess("Photo updated successfully");
		} catch (error) {
			console.log(error);
			//toastError(error.messages);
		}
	};

	const onUpdateUser = async (event) => {
		event.preventDefault();
		await updateUser(user);
		fetchUser(id);
		console.log("Contact updated successfully");

		//toastSuccess("Contact updated successfully");
	};

	useEffect(() => {
		fetchUser(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="profile">
				<div className="profile__details">
					<img src={user.photoUrl} alt={`Profile of ${user.name}`} />
					<div className="profile__metadata">
						<p className="profile__name">{user.name}</p>
						<p className="profile__muted">JPG or PNG</p>
						<button onClick={selectImage} className="btn">
							<i className="bi bi-cloud-upload"></i>Change Photo
						</button>
					</div>
				</div>
				<div className="profile__settings">
					<div>
						<form onSubmit={onUpdateUser} className="form">
							<div className="user-details">
								<input type="hidden" defaultValue={user.id} name="id" required />
								<div className="input-box">
									<span className="details">Name</span>
									<input type="text" value={user.name} onChange={onChange} name="name" required />
								</div>
								<div className="input-box">
									<span className="details">Email</span>
									<input type="text" value={user.email} onChange={onChange} name="email" required />
								</div>
								<div className="input-box">
									<span className="details">Password</span>
									<input type="text" value={user.password} onChange={onChange} name="password" required />
								</div>
								<div className="input-box">
									<span className="details">Votes</span>
									<input type="text" value={user.votes} onChange={onChange} name="votes" readOnly />
								</div>

								<div className="input-box">
									<span className="details">Election Participation</span>
									<input type="text" value={user.electionParticipation} onChange={onChange} name="status" readOnly />
								</div>
								<div className="input-box">
									<span className="details">Description</span>
									<textarea
										value={user.description}
										onChange={onChange}
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
										}}></textarea>
								</div>
							</div>
							<div className="form_footer">
								<button type="submit" className="btn">
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<form style={{ display: "none" }}>
				<input type="file" ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name="file" accept="image/*" />
			</form>
		</>
	);
}

export default Profile;
