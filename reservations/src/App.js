// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation bar */}
        <Navbar />

        {/* Main page container */}
        <div className="container mt-4">
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<Home />} />

            {/* Create Post page route */}
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>© {new Date().getFullYear()} Simple Blog Application</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
