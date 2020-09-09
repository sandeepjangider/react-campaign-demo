import React from 'react';

const Pagination = ({campaignsPerPage, totalCampaigns, paginate}) => {
    const pageNumbers = [];

    for(let i=1; i<=Math.ceil(totalCampaigns/campaignsPerPage); i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={(event) => paginate(event, number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Pagination;