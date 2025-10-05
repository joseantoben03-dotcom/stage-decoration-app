import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = ({ user, setUser }) => {
  // Logout handler
  const handleLogout = () => {
    // Remove user from localStorage (if stored there)
    localStorage.removeItem('user');
    // Clear user state
    if (setUser) setUser(null);
    // Reload to update navbar
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="nav-logo">Ethereal Blooms</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            {/* Always visible links */}
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/gallery">
              <Nav.Link>Our Art Works</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About Ethereal Blooms</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact">
              <Nav.Link>Contact Ethereal Blooms</Nav.Link>
            </LinkContainer>

            {/* Conditional links based on login */}
            {!user ? (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link>SignUp</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                {/* Dashboard link */}
                <LinkContainer
                  to={
                    user.role === 'CUSTOMER'
                      ? '/customer-dashboard'
                      : '/organizer-dashboard'
                  }
                >
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}

           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
