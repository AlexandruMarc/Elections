/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
	getAllCandidates,
	getAllUsers,
	saveUser,
	getUser,
} from "../../utils/ElectionService";
import { toastSuccess } from "../../utils/ToastService";
import Card from "./Card";
import Header from "../header/Header";

function DisplaingUsers() {
	const [data, setData] = useState({});
	const [usersData, setUsersData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [totalParticipants, setTotalParticipants] = useState(0);

	const location = useLocation();
	const isCandidatesPage = location.pathname === "/elections/candidates";
	const listData = isCandidatesPage ? data : usersData;

	// Collect all the participants in the election
	async function getCandidates(page = 0, size = 5) {
		try {
			setCurrentPage(page);
			const { data } = await getAllCandidates(page, size);
			setData(data);
			setTotalParticipants(data.totalElements);
		} catch (error) {
			console.log(error);
		}
	}

	// Collect all the users in the database
	async function getUsers(page = 0, size = 4) {
		try {
			setCurrentPage(page);
			const { data } = await getAllUsers(page, size);
			setUsersData(data);
		} catch (error) {
			console.log(error);
		}
	}

	// Function to be called from the Header to force an update
	async function handleParticipationChange(value) {
		const storedUserId = localStorage.getItem("userId");
		const { data } = await getUser(storedUserId);
		data.electionParticipation = value;
		await saveUser(data);

		localStorage.setItem("electionParticipation", value);
		toastSuccess("The participation in the voting has been updated!");
		await getCandidates(currentPage);
		await getUsers(currentPage);
	}

	useEffect(() => {
		getCandidates();
		getUsers();
	}, []);

	function handlePageChange(page) {
		if (isCandidatesPage) {
			getCandidates(page);
		} else {
			getUsers(page);
		}
	}

	return (
		<main className="main">
			{listData?.content?.length === 0 && <div>No Candidates</div>}
			<Header
				totalParticipants={totalParticipants}
				onParticipationChange={handleParticipationChange}
			/>
			<br />
			<ul className="user__list">
				{listData?.content?.length > 0 &&
					listData?.content?.map((item) => (
						<Card user={item} key={item.id} />
					))}
			</ul>
			{listData?.content?.length > 0 && listData?.totalPages > 1 && (
				<div className="pagination">
					<a
						onClick={() => handlePageChange(currentPage - 1)}
						className={0 === currentPage ? "disable" : ""}
					>
						{" "}
						&laquo;{" "}
					</a>

					{[...Array(listData.totalPages).keys()].map((page) => (
						<a
							onClick={() => handlePageChange(page)}
							className={currentPage === page ? "active" : ""}
							key={page}
						>
							{page + 1}
						</a>
					))}

					<a
						onClick={() => handlePageChange(currentPage + 1)}
						className={
							listData.totalPages === currentPage + 1
								? "disable"
								: ""
						}
					>
						&raquo;
					</a>
				</div>
			)}
		</main>
	);
}

export default DisplaingUsers;
