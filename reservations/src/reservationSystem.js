import React, { useState } from "react";

const areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
const timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

export default function ReservationSystem() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    area: "",
    timeslot: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/your-api-folder/create_reservation.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error submitting reservation");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Book a Conservation Area</h2>
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
          {areas.map((a, i) => (
            <option key={i} value={a}>{a}</option>
          ))}
        </select>
        <select
          name="timeslot"
          value={form.timeslot}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Reserve
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
