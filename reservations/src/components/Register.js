import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register.php`,
        formData,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setSuccess("Registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role Selection */}
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Admin Code only if Admin is selected */}
        {formData.role === "admin" && (
          <div className="mb-3">
            <label>Admin Secret Code</label>
            <input
              type="password"
              className="form-control"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              required={formData.role === "admin"}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
