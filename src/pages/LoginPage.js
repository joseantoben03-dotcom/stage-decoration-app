// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { API_BASE_URL } from '../config'; // ✅ Use your deployed backend URL here

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      // Save logged-in user in context
      login(res.data);

      // Redirect based on role
      const role = res.data.role?.toUpperCase();
      if (role === 'CUSTOMER') navigate('/customer-dashboard');
      else if (role === 'ORGANIZER') navigate('/organizer-dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <Container className="my-5">
      <div className="glass-card p-4">
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="btn-custom w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
