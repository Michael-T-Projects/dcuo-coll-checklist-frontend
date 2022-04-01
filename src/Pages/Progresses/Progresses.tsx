import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CollectionProgress from '../../Models/CollectionProgress';
import CollectionService from '../../Services/CollectionService';

export const Progresses = () => {
  const [collectionProgresses, setCollectionProgresses] = useState<CollectionProgress[]>();
  const navigate = useNavigate();

  useEffect(() => {
    CollectionService.findCollectionProgresses()
      .then((collectionProgresses) => setCollectionProgresses(collectionProgresses))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <h1>Collection Progresses</h1>
      {collectionProgresses &&
        (collectionProgresses.length === 0 ? (
          <>
            <p>You have not created any collection progresses yet</p>
            <Link to="/collections">
              <Button variant="primary">Explore Collections</Button>
            </Link>
          </>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {collectionProgresses.map((collectionProgress) => (
                <tr key={collectionProgress.id} onClick={() => navigate('/progresses/' + collectionProgress.id)}>
                  <td>{collectionProgress.collection.name}</td>
                  <td>
                    {collectionProgress.completedCollectionParts.length}/
                    {collectionProgress.collection.collectionParts.length} (
                    {Math.round(
                      (collectionProgress.completedCollectionParts.length /
                        collectionProgress.collection.collectionParts.length) *
                        100,
                    )}
                    %)
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ))}
    </>
  );
};
