import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';

export const App = () => {
  return (
    <>
      <Header />
      <Container className="mt-4 mb-4">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};
