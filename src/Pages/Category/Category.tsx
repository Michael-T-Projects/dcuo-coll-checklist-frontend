import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryModel from '../../Models/Category';
import Collection from '../../Models/Collection';
import Page from '../../Models/Page';
import CollectionService from '../../Services/CollectionService';

export const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<CategoryModel>();
  const [collections, setCollections] = useState<Page<Collection>>();
  const [hasLocation, setHasLocation] = useState(false);
  const [hasEvent, setHasEvent] = useState(false);
  const [hasEpisode, setHasEpisode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    CollectionService.findCategoryById(categoryId ? +categoryId : -1)
      .then((category) => {
        setCategory(category);

        CollectionService.findByCategoryId(category.id, 0, 9999)
          .then((collections) => {
            setCollections(collections);

            setHasLocation(collections.items.some((collection) => !!collection.location));
            setHasEvent(collections.items.some((collection) => !!collection.event));
            setHasEpisode(collections.items.some((collection) => !!collection.episode));
          })
          .catch(() => undefined);
      })
      .catch(() => undefined);
  }, [categoryId]);

  return category ? (
    <>
      <h1>{category.name}</h1>
      {collections && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              {hasLocation && <th>Location</th>}
              {hasEvent && <th>Event</th>}
              {hasEpisode && <th>Episode</th>}
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {collections.items.map((collection) => (
              <tr
                key={collection.id}
                onClick={() => navigate('/collections/' + collection.category.id + '/' + category.id)}
              >
                <td>{collection.name}</td>
                {hasLocation && <td>{collection.location}</td>}
                {hasEvent && <td>{collection.event}</td>}
                {hasEpisode && <td>{collection.episode}</td>}
                <td>{collection.reward}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  ) : null;
};
