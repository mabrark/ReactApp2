import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/bookings.php?page=${currentPage}`);
        if (response.data && response.data.bookings) {
          setBookings(response.data.bookings);
          setTotalBookings(response.data.totalBookings || 0);
        } else {
          setBookings([]);
          setTotalBookings(0);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings.');
      } finally {
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
      {isLoading && <p>Loading bookings...</p>}

      {!isLoading && bookings.length > 0 ? (
        <div className="row">
          {bookings.map(booking => (
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
          ))}
        </div>
      ) : !isLoading && <p>No bookings available.</p>}

      {totalPages > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
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
      )}
    </div>
  );
}

export default BookingList;
