import axios from "axios";

// Set up the base URL for the API endpoint
const API_URL = "http://localhost:8080/elections";

export async function saveUser(user) {
	return await axios.post(`${API_URL}/register`, user);
}

export async function login({ email, password }) {
	try {
		const response = await axios.post(`${API_URL}/login`, { email, password });
		return response.data; // Return the data if the login is successful
	} catch (error) {
		// Throw the error to be handled in the calling function
		throw error.response ? error.response.data : new Error("Network error");
	}
}

export async function getAllCandidates(page = 0, size = 10) {
	return await axios.get(`${API_URL}/candidates?page=${page}&size=${size}`);
}

export async function getAllUsers(page = 0, size = 10) {
	return await axios.get(`${API_URL}/users?page=${page}&size=${size}`);
}

export async function getUser(id) {
	return await axios.get(`${API_URL}/${id}`);
}

export async function updateUser(user) {
	return await axios.post(`${API_URL}/register`, user);
}

export async function updatePhoto(formData) {
	return await axios.put(`${API_URL}/photo`, formData);
}
