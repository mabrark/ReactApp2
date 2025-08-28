import React, { useState } from "react";

const areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake Point'];
const timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

export default function ReservationSystem() {
  const [form, setForm] = useState({ name: "", email: "", area: "", timeslot: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost/reservation-api";
  const apiUrl = `${API_BASE_URL}/create_reservation.php`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.area || !form.timeslot) {
      setMessage("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setMessage(data.message || "Reservation successful!");
        setForm({ name: "", email: "", area: "", timeslot: "" });
      } else {
        setMessage(data.message || `Failed to submit reservation. API URL: ${apiUrl}`);
      }

    } catch (error) {
      console.error("Reservation error:", error);
      setMessage(`Error submitting reservation. Check API URL: ${apiUrl}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Book a Conservation Area</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="area"
          value={form.area}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Conservation Area</option>
          {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
        </select>
        <select
          name="timeslot"
          value={form.timeslot}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Reserving..." : "Reserve"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      <p className="mt-2 text-sm text-gray-500 text-center">
        API URL: <code>{apiUrl}</code>
      </p>
    </div>
  );
}
