import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Table, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Category from '../../Models/Category';
import CollectionModel from '../../Models/Collection';
import User from '../../Models/User';
import CollectionService from '../../Services/CollectionService';

export const Collection = () => {
  const { categoryId, collectionId } = useParams();
  const [collection, setCollection] = useState<CollectionModel>();
  const [category, setCategory] = useState<Category>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    CollectionService.findCategoryById(categoryId ? +categoryId : -1)
      .then((category) => {
        setCategory(category);
      })
      .catch(() => undefined)
      .then(() => {
        CollectionService.findById(collectionId ? +collectionId : -1)
          .then((collection) => {
            setCollection(collection);
          })
          .catch(() => undefined);
      });
  }, []);

  useEffect(() => {
    if (category && collection && category.id !== collection.category.id) {
      navigate('/collections/' + category.id);
    }
  }, [category, collection]);

  const handleCreate = () => {
    const userJson = sessionStorage.getItem('user');

    if (!userJson) {
      setShowLoginModal(true);
    } else {
      setSaveLoading(true);

      const user: User = JSON.parse(userJson);
      CollectionService.saveProgress(user.id, collection ? collection.id : -1)
        .then((collectionProgress) => {
          navigate('/progresses/' + collectionProgress.id);
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            setToastMessage(error.response.data.message);
          } else {
            setToastMessage('An unknown error occurred');
          }

          setShowToast(true);
          setSaveLoading(false);
        });
    }
  };

  return category && collection ? (
    <>
      <ToastContainer position="bottom-center">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide className="mb-4">
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <h1>{collection.name}</h1>
      <Link to={'/collections/' + category.id}>
        <h3>{category.name}</h3>
      </Link>
      <Row>
        <Col className="d-flex justify-content-between align-items-center">
          <h2 className="mt-3">Collection Parts</h2>
          <Button variant="primary" onClick={handleCreate} disabled={saveLoading}>
            Create Progress
          </Button>
        </Col>
      </Row>
      <Table striped bordered>
        <tbody>
          {collection.collectionParts.map((collectionPart) => (
            <tr key={collectionPart.id}>
              <td>{collectionPart.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need to be logged in to create a collection progress.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : null;
};
