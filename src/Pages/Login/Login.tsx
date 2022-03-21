import React from 'react';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';
import './Login.css';
import Logo from '../../logo.png';

export const Login = () => {
  return (
    <div className="text-center login-page">
      <main className="form-login">
        <Form>
          <Image className="mb-4" src={Logo} alt="" width={72} height={72} />
          <h1 className="h3 mb-3 fw-normal">Login</h1>

          <Form.Group>
            <FloatingLabel label="Username">
              <Form.Control type="text" placeholder="john.doe@example.com" />
            </FloatingLabel>
          </Form.Group>

          <Form.Group>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
          </Form.Group>

          <Button variant="primary" size="lg" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </main>
    </div>
  );
};
