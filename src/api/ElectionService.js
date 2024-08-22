import axios from "axios";

// Set up the base URL for the API endpoint
const API_URL = "http://localhost:8080/elections";

export async function saveUser(user) {
	return await axios.post(API_URL, user);
}

export async function getAllCandidates(page = 0, size = 10) {
	return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getAllUsers(page = 0, size = 10) {
	return await axios.get(`${API_URL}/users?page=${page}&size=${size}`);
}

export async function getUser(id) {
	return await axios.get(`${API_URL}/${id}`);
}

export async function updateUser(user) {
	return await axios.post(API_URL, user);
}

export async function updatePhoto(formData) {
	return await axios.put(`${API_URL}/photo`, formData);
}

