import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Image, Toast, ToastContainer } from 'react-bootstrap';
import './Login.css';
import Logo from '../../logo.png';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthService from '../../Services/AuthService';

type Inputs = {
  username: string;
  password: string;
};

export const Login = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    return new Promise<void>((resolve) => {
      AuthService.login(data.username, data.password)
        .then(() => {
          window.location.href = '/';
          resolve();
        })
        .catch((error) => {
          if (error.response && error.response.status) {
            switch (error.response.status) {
              case 401:
                setToastMessage('Invalid username or password.');
                setShowToast(true);
                break;
              default:
                setToastMessage('An unknown error occurred.');
                setShowToast(true);
                break;
            }
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
      <div className="text-center login-page">
        <main className="form-login">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Image className="mb-4" src={Logo} alt="" width={72} height={72} />
            <h1 className="h3 mb-3 fw-normal">Login</h1>

            <Form.Group>
              <FloatingLabel label="Username">
                <Form.Control
                  type="text"
                  placeholder="john.doe@example.com"
                  required
                  {...register('username', { required: true, minLength: 2, maxLength: 30 })}
                  isInvalid={!!errors.username}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label="Password" className="mb-3">
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
              disabled={!!errors.username || !!errors.password || isSubmitting}
            >
              Login
            </Button>
          </Form>
        </main>
      </div>
    </>
  );
};
