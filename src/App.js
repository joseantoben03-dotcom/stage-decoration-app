// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ClientReviewPage from './pages/ClientReviewPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import { AuthProvider, useAuth } from './auth/AuthContext';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <AppNavbar user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/customer-dashboard"
            element={
              user?.role?.toUpperCase() === 'CUSTOMER' ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/organizer-dashboard"
            element={
              user?.role?.toUpperCase() === 'ORGANIZER' ? (
                <OrganizerDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
