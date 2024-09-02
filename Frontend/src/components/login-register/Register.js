import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../../utils/ElectionService";
import { toastInfo, toastSuccess, toastWarning } from "../../utils/ToastService";

function Register() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		electionParticipation: false,
		photo: "",
	});

	async function handleRegister(event) {
		event.preventDefault();
		try {
			const { data } = await saveUser(values);

			const formData = new FormData();
			formData.append("id", data.id);

			localStorage.setItem("userId", data.id);
			localStorage.setItem("electionParticipation", data.electionParticipation);
			navigate(`/elections/profile/${data.id}`);
			toastSuccess("Successfully registered");
		} catch (error) {
			//console.error("Error registering user", error);
			toastWarning("User already registered!");
			setTimeout(() => {
				toastInfo("Please go to the Login page!, Thanks!");
			}, 2000);
		}
	}

	function onChange(event) {
		setValues({ ...values, [event.target.name]: event.target.value });
	}

	return (
		<>
			<div className="modal">
				<div className="modal__header">
					<h3>Register</h3>
				</div>
				<div className="divider"></div>
				<div className="modal__body">
					<form onSubmit={handleRegister}>
						<div className="user-details">
							<div className="input-box">
								<span className="details">Name</span>
								<input type="text" value={values.name} 
										onChange={onChange} name="name" required />
							</div>
							<div className="input-box">
								<span className="details">Email</span>
								<input type="email" value={values.email} 
										onChange={onChange} name="email" required />
							</div>
							<div className="input-box">
								<span className="details">Password</span>
								<input type="password" value={values.password} 
										onChange={onChange} name="password" required />
							</div>
						</div>
						<div className="form_footer">
							<button type="submit" className="btn">
								Submit
							</button>
						</div>
					</form>
					<div className="form_footer">
						<p>Do you have an account?{" "}
							<a href="/elections/login">
								{" "}
								<i className="bi bi-arrow-right-circle-fill"></i>Login
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;
