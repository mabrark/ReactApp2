// src/components/CreatePost.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/ReactApp2/backend/api/create_post.php', {
        title,
        content,
        author
      });

      if (response.data.message) {
        setMessage(response.data.message);
        // Navigate back to home after success (optional)
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Error creating post. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Post</h2>

      {message && <div className="alert alert-info mt-2">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
