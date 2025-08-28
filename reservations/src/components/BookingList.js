import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BookingList() {
  const [bookings, setBookings] = useState([]); // fixed typo
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/bookings.php?page=${currentPage}`);
        setBookings(response.data.bookings); // fix: store bookings
        setTotalBookings(response.data.totalBookings); // fix duplicate line
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load bookings.');
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [currentPage]);

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Bookings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {isLoading ? (
          <p>Loading bookings...</p>
        ) : bookings.length ? (
          bookings.map(booking => (
            <div className="col-md-6" key={booking.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{booking.title}</h5>
                  <p className="card-text">
                    By {booking.author} on {new Date(booking.publish_date).toLocaleDateString()}
                  </p>
                  <Link to={`/booking/${booking.id}`} className="btn btn-primary">Read More</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goToPreviousPage}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={goToNextPage}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookingList;
