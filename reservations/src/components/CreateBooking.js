import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateBooking() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [timeslot, setTimeslot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake Point'];
  const timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  // Constant API URL, no state needed
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost/reservation-api";
  const apiUrl = `${API_BASE_URL}/create_reservation.php`;

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !area.trim() || !timeslot.trim()) {
      setMessage("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, { name, email, area, timeslot });

      if (response.data.status === 'success') {
        setMessage(response.data.message || "Reservation created successfully!");
        setName('');
        setEmail('');
        setArea('');
        setTimeslot('');
        // navigate('/'); // optional redirect after success
      } else {
        setMessage(response.data.message || "Failed to create booking.");
      }

    } catch (error) {
      console.error(error);
      setMessage(`Failed to create booking. API URL: ${apiUrl}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Reservation</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Conservation Area</label>
          <select className="form-select" value={area} onChange={(e) => setArea(e.target.value)} required>
            <option value="">Select an Area</option>
            {areas.map((a, idx) => <option key={idx} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Timeslot</label>
          <select className="form-select" value={timeslot} onChange={(e) => setTimeslot(e.target.value)} required>
            <option value="">Select a Timeslot</option>
            {timeSlots.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Creating Reservation..." : "Create Reservation"}
        </button>
      </form>

      <p className="mt-3 text-muted">API URL: <code>{apiUrl}</code></p>
    </div>
  );
}

export default CreateBooking;
