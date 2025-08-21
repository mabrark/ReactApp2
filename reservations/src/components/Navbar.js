// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="Navbar Navbar-expand-lg Navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Blog Application
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#NavbarNav"
          aria-controls="NavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="Navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse Navbar-collapse" id="NavbarNav">
          <ul className="Navbar-Nav ms-auto">
            <li className="Nav-item">
              <Link className="Nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="Nav-item">
              <Link className="Nav-link" to="/create-post">
                Create Post
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
