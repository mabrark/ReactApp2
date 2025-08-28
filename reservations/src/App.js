
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateBooking from './components/CreateBooking';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar should be outside of Routes */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-booking" element={<CreateBooking />} />
        </Routes>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>© {new Date().getFullYear()} Simple Reservation Application</p>
      </footer>
    </Router>
  );
}

export default App;
