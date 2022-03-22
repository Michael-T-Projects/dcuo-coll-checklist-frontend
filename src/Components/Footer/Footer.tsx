import React from 'react';
import { Container } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <span className="text-muted">
          DCUO CollChecklist &mdash; Open Source Project by{' '}
          <a href="https://mt-projects.xyz" target="_blank" rel="noreferrer">
            Michael T. Projects
          </a>{' '}
          &mdash; Source available at{' '}
          <a href="https://github.com/Michael-T-Projects" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </span>
      </Container>
    </footer>
  );
};
