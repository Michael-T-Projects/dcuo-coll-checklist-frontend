import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionProgress from '../../Models/CollectionProgress';
import CollectionService from '../../Services/CollectionService';
import { BsCheck, BsFillTrashFill } from 'react-icons/bs';

export const Progress = () => {
  const { collectionProgressId } = useParams();
  const [collectionProgress, setCollectionProgress] = useState<CollectionProgress>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    CollectionService.findCollectionProgressById(collectionProgressId ? +collectionProgressId : -1)
      .then((collectionProgress) => {
        collectionProgress.collection.collectionParts = collectionProgress.collection.collectionParts.filter(
          (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
        );
        setCollectionProgress(collectionProgress);
      })
      .catch(() => undefined);
  }, []);

  const onCheck = (collectionPartId: number) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    CollectionService.updateCollectionProgress(collectionProgress ? collectionProgress.id : -1, [
      ...(collectionProgress
        ? collectionProgress.completedCollectionParts.map((collectionPart) => collectionPart.id)
        : []),
      collectionPartId,
    ])
      .then((collectionProgress) => {
        collectionProgress.collection.collectionParts = collectionProgress.collection.collectionParts.filter(
          (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
        );
        setCollectionProgress(collectionProgress);
      })
      .catch(() => undefined)
      .then(() => {
        setIsLoading(false);
      });
  };

  const onUncheck = (collectionPartId: number) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    CollectionService.updateCollectionProgress(
      collectionProgress ? collectionProgress.id : -1,
      collectionProgress
        ? collectionProgress.completedCollectionParts
            .filter((collectionPart) => collectionPart.id !== collectionPartId)
            .map((collectionPart) => collectionPart.id)
        : [],
    )
      .then((collectionProgress) => {
        collectionProgress.collection.collectionParts = collectionProgress.collection.collectionParts.filter(
          (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
        );
        setCollectionProgress(collectionProgress);
      })
      .catch(() => undefined)
      .then(() => {
        setIsLoading(false);
      });
  };

  const onDelete = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    CollectionService.deleteCollectionProgress(collectionProgress ? collectionProgress.id : -1)
      .then(() => navigate('/progresses'))
      .catch(() => setIsLoading(false));
  };

  return (
    <>
      <h1>Collection Progress:</h1>
      {collectionProgress && (
        <>
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <h3>{collectionProgress.collection.name}</h3>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={6}>
              <h2>Completed Parts</h2>
              <Table striped bordered>
                <tbody>
                  {collectionProgress.completedCollectionParts.map((collectionPart) => (
                    <tr key={collectionPart.id}>
                      <td>
                        <Button onClick={() => onUncheck(collectionPart.id)} variant="danger">
                          <BsFillTrashFill />
                        </Button>
                      </td>
                      <td>{collectionPart.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col lg={6}>
              <h2>All Collection Parts</h2>
              <Table striped bordered>
                <tbody>
                  {collectionProgress.collection.collectionParts.map((collectionPart) => (
                    <tr key={collectionPart.id}>
                      <td>
                        <Button
                          onClick={() => onCheck(collectionPart.id)}
                          variant={
                            collectionProgress.completedCollectionParts.find((v) => v.id === collectionPart.id)
                              ? 'secondary'
                              : 'success'
                          }
                          disabled={
                            !!collectionProgress.completedCollectionParts.find((v) => v.id === collectionPart.id)
                          }
                        >
                          <BsCheck />
                        </Button>
                      </td>
                      <td>{collectionPart.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your collection progress?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
