
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateBooking from './components/CreateBooking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar outside of Routes so it shows on all pages */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-booking" element={<CreateBooking />} />
        </Routes>

        <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>© {new Date().getFullYear()} Simple Reservation Application</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
