import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/get_booking.php?id=${id}`
      );
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (!booking) {
    return <div>Loading booking details...</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Booking Details</h2>
      <p><strong>Name:</strong> {booking.name}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Conservation Area:</strong> {booking.area}</p>
      <p><strong>Timeslot:</strong> {booking.timeslot}</p>
      <hr />
      <small className="text-muted">
        Booking ID: {booking.id}
      </small>
    </div>
  );
};

export default Booking;
