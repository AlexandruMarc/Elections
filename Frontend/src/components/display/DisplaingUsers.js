/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllCandidates, getAllUsers } from "../../utils/ElectionService";
import Card from "./Card";
import Header from "../header/Header";

function DisplaingUsers() {
	const [data, setData] = useState({});
	const [usersData, setUsersData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);

	const location = useLocation();
	const isCandidatesPage = location.pathname === "/elections/candidates";
	const listData = isCandidatesPage ? data : usersData;

	// Collect all the participants in the election
	async function getCandidates(page = 0, size = 5) {
		try {
			setCurrentPage(page);
			const { data } = await getAllCandidates(page, size);
			setData(data);
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

	useEffect(() => {
		getCandidates();
		getUsers();
	}, []);

	// Conditionally use the appropriate function
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
			<Header />
			<br />

			{/* Displaying the candidates */}
			<ul className="user__list">{listData?.content?.length > 0 && listData?.content?.map((item) => <Card user={item} key={item.id} />)}</ul>

			{/* In case that there are multiple pages of candidates or users and I want to move between them */}
			{listData?.content?.length > 0 && listData?.totalPages > 1 && (
				<div className="pagination">
					<a onClick={() => handlePageChange(currentPage - 1)} className={0 === currentPage ? "disable" : ""}>
						{" "}
						&laquo;{" "}
					</a>

					{/* Creates an array, then map over these pages, and for every page render an anchor tag. 
						The text for the anchor tag is going to be the page number + 1 */}
					{[...Array(listData.totalPages).keys()].map((page) => (
						<a onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""} key={page}>
							{page + 1}
						</a>
					))}

					<a onClick={() => handlePageChange(currentPage + 1)} className={listData.totalPages === currentPage + 1 ? "disable" : ""}>
						&raquo;
					</a>
				</div>
			)}
		</main>
	);
}

export default DisplaingUsers;
