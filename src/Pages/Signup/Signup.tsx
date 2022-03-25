import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Image, Toast, ToastContainer } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthService from '../../Services/AuthService';
import Logo from '../../logo.png';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export const Signup = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    return new Promise<void>((resolve) => {
      AuthService.register(data.username, data.email, data.password)
        .then(() => {
          navigate('/login');
          resolve();
        })
        .catch((error) => {
          if (error.response && error.response.status === 400 && error.response.data && error.response.data.message) {
            setToastMessage(error.response.data.message);
            setShowToast(true);
          } else {
            setToastMessage('An unknown error occurred.');
            setShowToast(true);
          }

          resolve();
        });
    });
  };

  return (
    <>
      <ToastContainer position="bottom-center">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide className="mb-4">
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="text-center signup-page">
        <main className="form-signup">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Image className="mb-4" src={Logo} alt="" width={72} height={72} />
            <h1 className="h3 mb-3 fw-normal">Signup</h1>

            <Form.Group>
              <FloatingLabel label="Username">
                <Form.Control
                  type="text"
                  placeholder="John_Doe"
                  required
                  {...register('username', { required: true, minLength: 2, maxLength: 30 })}
                  isInvalid={!!errors.username}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label="Email">
                <Form.Control
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register('email', {
                    required: true,
                    minLength: 6,
                    maxLength: 50,
                    pattern: {
                      value:
                        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                      message: 'Invalid email address',
                    },
                  })}
                  isInvalid={!!errors.email}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: true, maxLength: 120 })}
                  isInvalid={!!errors.password}
                />
              </FloatingLabel>
            </Form.Group>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-100"
              disabled={!!errors.username || !!errors.email || !!errors.password || isSubmitting}
            >
              Sign Up
            </Button>
          </Form>
        </main>
      </div>
    </>
  );
};
