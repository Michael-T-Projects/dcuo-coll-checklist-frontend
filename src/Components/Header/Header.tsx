import React, { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import User from '../../Models/User';
import AuthService from '../../Services/AuthService';

export const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setCurrentUser(currentUser);
  }, []);

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          DCUO CollChecklist
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/collections">
              Collections
            </Nav.Link>
          </Nav>
          {currentUser ? (
            <>
              <Navbar.Text className="me-2">
                <Link to="/progresses">{currentUser.username}</Link>
              </Navbar.Text>
              <Button
                variant="danger"
                onClick={() => {
                  AuthService.logout();
                  window.location.href = '/';
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="me-2">
                <Button variant="light">Login</Button>
              </Link>
              <Link to="/signup" className="me-2">
                <Button variant="outline-light">Sign Up</Button>
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
