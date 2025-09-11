import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/booking.php?id=${id}`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setBooking(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch booking.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching booking.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <div>Loading booking details...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!booking) return <div>No booking found.</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Booking Details</h2>

      <img
        src={booking.image || "http://localhost/reservation-api/uploads/placeholder.jpg"}
        alt={booking.area}
        style={{ width: "100%", maxWidth: "500px", borderRadius: "10px", marginBottom: "20px" }}
        onError={(e) => { e.target.onerror = null; e.target.src = "http://localhost/reservation-api/uploads/placeholder.jpg"; }}
      />

      <p><strong>Name:</strong> {booking.name}</p>
      <p><strong>Email:</strong> {booking.email === "Hidden" ? <em>Hidden (Admin only)</em> : booking.email}</p>
      <p><strong>Conservation Area:</strong> {booking.area}</p>
      <p><strong>Timeslot:</strong> {booking.timeslot}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <hr />
      <small className="text-muted">Booking ID: {booking.id}</small>
    </div>
  );
};

export default Booking;
