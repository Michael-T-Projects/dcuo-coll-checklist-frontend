import React, { useEffect, useState } from 'react';
import { Button, Col, FloatingLabel, Form, FormGroup, Row, Toast, ToastContainer } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import Category from '../../Models/Category';
import CollectionService from '../../Services/CollectionService';

type Inputs = {
  name: string;
  reward: string;
  location?: string;
  event?: string;
  episode?: string;
  categoryId: number;
  collectionParts: any[];
};

export const AddCollection = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastStatus, setToastStatus] = useState<'Error' | 'Success'>();
  const { register, handleSubmit, control, reset } = useForm<Inputs>();
  const { fields, append, remove } = useFieldArray({
    name: 'collectionParts',
    control,
  });

  useEffect(() => {
    CollectionService.findAllCategories()
      .then((categories) => {
        setCategories(categories);
      })
      .catch(() => undefined);
  }, []);

  const onSubmit = (values: Inputs) => {
    CollectionService.saveCollection({
      name: values.name,
      reward: values.reward,
      location: values.location !== '' ? values.location : null,
      event: values.event !== '' ? values.event : null,
      episode: values.episode !== '' ? values.episode : null,
      category_id: values.categoryId,
      collection_parts: values.collectionParts.map((collectionPart) => collectionPart.value),
    })
      .then(() => {
        setToastStatus('Success');
        setToastMessage('Collection added successfully');
        reset();
      })
      .catch(() => {
        setToastStatus('Error');
        setToastMessage('An error occurred');
      })
      .then(() => {
        setShowToast(true);
      });
  };

  return (
    <>
      <ToastContainer position="bottom-center">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide className="mb-4">
          <Toast.Header>
            <strong className="me-auto">{toastStatus}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <h1>Add Collection</h1>
      {categories && (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form.Group>
            <FloatingLabel label="Name*">
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Name*"
                required
                {...register('name', { required: true, minLength: 2, maxLength: 100 })}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel label="Reward*">
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Reward*"
                required
                {...register('reward', { required: true, minLength: 2, maxLength: 100 })}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel label="Location">
              <Form.Control className="mb-3" type="text" placeholder="Location" {...register('location')} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel label="Event">
              <Form.Control className="mb-3" type="text" placeholder="Event" {...register('event')} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel label="Episode">
              <Form.Control className="mb-3" type="text" placeholder="Episode" {...register('episode')} />
            </FloatingLabel>
          </Form.Group>
          <Form.Select required className="mb-3" {...register('categoryId', { required: true })}>
            <option disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <h3>Collection Parts</h3>
          {fields.map((field, index) => (
            <Row key={index} className="mb-3">
              <Col xs={10}>
                <Form.Group>
                  <FloatingLabel label="Collection Part">
                    <Form.Control
                      type="text"
                      placeholder="Collection Part"
                      required
                      {...register(`collectionParts.${index}.value`, { required: true })}
                    />
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Button type="button" variant="danger" className="h-100 w-100" onClick={() => remove(index)}>
                  Delete
                </Button>
              </Col>
            </Row>
          ))}
          <Button className="mb-3 d-block" type="button" variant="success" onClick={() => append({})}>
            Add Collection Part
          </Button>
          <Button type="submit">Add Collection</Button>
        </Form>
      )}
    </>
  );
};
