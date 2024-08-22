/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Participant from "./Participant";

function Participants({ data, currentPage, getAllCandidates }) {
	return (
		<main className="main">
			{data?.content?.length === 0 && <div>No Candidates</div>}

			<ul className="contact__list">{data?.content?.length > 0 && data?.content?.map((candidate) => <Participant user={candidate} key={candidate.id} />)}</ul>

            {/* In case that here are multiple pages of candidates and I want to move between them */}
			{data?.content?.length > 0 && data?.totalPages > 1 && (
				<div className="pagination">
					<a onClick={() => getAllCandidates(currentPage - 1)} className={0 === currentPage ? "disable" : ""}>
						&laquo;
					</a>

                    {/* I create an array then map over these pages and for every page 
                        render an anchor tag and for the anchor tag the text is going to be a page + 1 */}
					{[...Array(data.totalPages).keys()].map((page, index) => (
						<a onClick={() => getAllCandidates(page)} className={currentPage === page ? "active" : ""} key={page}>
							{page + 1}
						</a>
					))}

					<a onClick={() => getAllCandidates(currentPage + 1)} className={data.totalPages === currentPage + 1 ? "disable" : ""}>
						&raquo;
					</a>
				</div>
			)}
		</main>
	);
}

export default Participants;
