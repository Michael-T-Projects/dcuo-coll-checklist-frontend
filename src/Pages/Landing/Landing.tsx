import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Collection from '../../Models/Collection';
import Page from '../../Models/Page';
import CollectionService from '../../Services/CollectionService';
import './Landing.css';

export const Landing = () => {
  const [collections, setCollections] = useState<Page<Collection>>();
  const navigate = useNavigate();

  useEffect(() => {
    CollectionService.findAll(0, 10)
      .then((collections) => {
        setCollections(collections);
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <div className="p-5 mb-4 bg-light rounded-3">
        <Container fluid className="py-5">
          <h1 className="display-5 fw-bold">DCUO CollChecklist</h1>
          <p className="col-md-8 fs-4">
            DCUO CollChecklist is a tool to track your progress in DC Universe Online collections. This can be very
            useful when completing same collections over and over with different characters.
          </p>
          <Link to="/collections">
            <Button variant="primary" size="lg" type="button">
              Explore Collections
            </Button>
          </Link>
        </Container>
      </div>
      {collections && (
        <>
          <h1>Explore Collections</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {collections.items.map((collection) => (
                <tr
                  key={collection.id}
                  onClick={() => navigate('/collections/' + collection.category.id + '/' + collection.id)}
                >
                  <td>{collection.category.name}</td>
                  <td>{collection.name}</td>
                  <td>{collection.reward}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Link to="/collections">
            <Button variant="primary">Show more</Button>
          </Link>
        </>
      )}
    </>
  );
};
