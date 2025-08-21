import React, { useState } from "react";

const areas = ["Bruce Mill", "Rockwood", "Rattray", "Rattlesnake Point"];
const timeSlots = [
  "9:00am - 12:00pm",
  "12:00pm - 3:00pm",
  "3:00pm - 6:00pm"
];

export default function ReservationSystem() {
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState("");
  const [area, setArea] = useState(areas[0]);
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent double booking
    const exists = reservations.find(
      (r) => r.area === area && r.timeSlot === timeSlot
    );
    if (exists) {
      alert("This time slot is already booked at " + area);
      return;
    }

    const newReservation = { name, area, timeSlot };
    setReservations([...reservations, newReservation]);
    setName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Conservation Area Reservations</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          {areas.map((a, index) => (
            <option key={index} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          {timeSlots.map((t, index) => (
            <option key={index} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit">Reserve</button>
      </form>

      <h2>Current Reservations</h2>
      <ul>
        {reservations.map((res, index) => (
          <li key={index}>
            {res.name} - {res.area} - {res.timeSlot}
          </li>
        ))}
      </ul>
    </div>
  );
}
