import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Category from '../../Models/Category';
import Collection from '../../Models/Collection';
import Page from '../../Models/Page';
import CollectionService from '../../Services/CollectionService';
import './Collections.css';

interface TableStructure {
  category: Category;
  collections: Page<Collection> | undefined;
  hasLocation: boolean;
  hasEvent: boolean;
  hasEpisode: boolean;
}

export const Collections = () => {
  const [tableEntries, setTableEntries] = useState<TableStructure[]>([]);

  const fetchData = async () => {
    try {
      const newTableEntries: TableStructure[] = [];
      const categories = await CollectionService.findAllCategories();

      for (const category of categories) {
        const collections = await CollectionService.findByCategoryId(category.id, 0, 10);

        newTableEntries.push({
          category,
          collections,
          hasLocation: collections.items.some((collection) => !!collection.location),
          hasEvent: collections.items.some((collection) => !!collection.event),
          hasEpisode: collections.items.some((collection) => !!collection.episode),
        });
      }

      setTableEntries(newTableEntries);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1>Collection Categories</h1>
      {tableEntries.map((tableEntry) => (
        <div key={tableEntry.category.id} className="mb-3">
          <h1>{tableEntry.category.name}</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                {tableEntry.hasLocation && <th>Location</th>}
                {tableEntry.hasEvent && <th>Event</th>}
                {tableEntry.hasEpisode && <th>Episode</th>}
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {tableEntry.collections?.items.map((collection) => (
                <tr key={collection.id}>
                  <td>{collection.name}</td>
                  {tableEntry.hasLocation && <td>{collection.location}</td>}
                  {tableEntry.hasEvent && <td>{collection.event}</td>}
                  {tableEntry.hasEpisode && <td>{collection.episode}</td>}
                  <td>{collection.reward}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </>
  );
};
