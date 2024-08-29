import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/ElectionService";
import { toastSuccess, toastError } from "../api/ToastService";

const Login = () => {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState("");

	async function handleUserLogin(values) {
		try {
			const data = await login(values);
			if (typeof data === "object" && data !== null) {
				// The data returned correctly
				return { success: true, data };
			} else {
				// In case the data is not a valid object
				return { success: false, error: "Invalid response from server" };
			}
		} catch (error) {
			// Handle the error returned by the backend
			return { success: false, error: error.message || "Email or Password are not correct! Please try again." };
		}
	}

	const handleLogin = async (event) => {
		event.preventDefault();
		const result = await handleUserLogin(values);
		setErrorMessage("");

		if (result.success) {
			localStorage.setItem("userId", result.data.id);
			localStorage.setItem("electionParticipation", result.data.electionParticipation);
			navigate(`/elections/profile/${result.data.id}`);
			toastSuccess("Loged in successfully");
		} else {
			//console.error("Login failed:", result.error);
			toastError("Login failed");
			setErrorMessage(result.error);
		}
	};

	const onChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	return (
		<>
			<div className="modal">
				<div className="modal__header">
					<h3>Login</h3>
				</div>
				<div className="divider"></div>
				<div className="modal__body">
					<form onSubmit={handleLogin}>
						<div className="user-details">
							<div className="input-box">
								<span className="details">Email</span>
								<input type="email" value={values.email} onChange={onChange} name="email" required />
							</div>
							<div className="input-box">
								<span className="details">Password</span>
								<input type="password" value={values.password} onChange={onChange} name="password" required />
							</div>
						</div>
						<div className="form_footer">
							<button type="submit" className="btn">
								Submit
							</button>
						</div>
					</form>
					{errorMessage && (
						<div className="form_footer">
							<p className="error">{errorMessage}</p>
						</div>
					)}
					<div className="form_footer">
						<p>
							Don't have an account?{" "}
							<a href="/elections/register">
								{" "}
								<i className="bi bi-arrow-right-circle-fill"></i>Register
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
