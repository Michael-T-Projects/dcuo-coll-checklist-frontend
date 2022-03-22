import React, { useEffect, useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
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
        {currentUser && (
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <a href="#">{currentUser.username}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};
