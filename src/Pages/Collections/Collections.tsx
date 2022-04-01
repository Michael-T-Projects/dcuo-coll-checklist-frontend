import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Pagination, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Category from '../../Models/Category';
import Collection from '../../Models/Collection';
import Page from '../../Models/Page';
import CollectionService from '../../Services/CollectionService';
import './Collections.css';

type Inputs = {
  searchQuery: string;
  category: string;
};

interface TableStructure {
  category: Category;
  collections: Page<Collection> | undefined;
  hasLocation: boolean;
  hasEvent: boolean;
  hasEpisode: boolean;
}

export const Collections = () => {
  const [tableEntries, setTableEntries] = useState<TableStructure[]>([]);
  const [value, setValue] = useState(0);
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();

  const useForceUpdate = () => {
    return () => setValue((value) => value + 1);
  };

  const forceUpdate = useForceUpdate();

  const onSubmit = (values: Inputs) => {
    navigate({
      pathname: '/search',
      search: '?query=' + values.searchQuery + (values.category !== 'all' ? '&category=' + values.category : ''),
    });
  };

  const fetchCategory = async (tableEntry: TableStructure, page: number) => {
    const collections = await CollectionService.findByCategoryId(tableEntry.category.id, page, 10);

    const currentTableEntries = tableEntries;
    const foundIndex = currentTableEntries.findIndex((te) => te.category.id === tableEntry.category.id);

    currentTableEntries[foundIndex].collections = collections;
    setTableEntries(currentTableEntries);
    forceUpdate();
  };

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
      <h1>Search Collections</h1>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group>
          <FloatingLabel label="Search Query">
            <Form.Control
              className="mb-3"
              type="search"
              placeholder="Search Query"
              required
              {...register('searchQuery', { required: true, minLength: 2, maxLength: 30 })}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Select className="mb-3" {...register('category')}>
          <option value="all">All categories</option>
          {tableEntries.map((tableEntry) => (
            <option key={tableEntry.category.id} value={tableEntry.category.id}>
              {tableEntry.category.name}
            </option>
          ))}
        </Form.Select>
        <Button type="submit" variant="primary" className="w-100">
          Search
        </Button>
      </Form>
      <hr />
      <h1>Collection Categories</h1>
      {tableEntries.map((tableEntry) => (
        <div key={tableEntry.category.id} className="mb-3">
          <Link to={'/collections/' + tableEntry.category.id}>
            <h3>{tableEntry.category.name}</h3>
          </Link>
          <Table striped bordered hover responsive>
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
                <tr
                  key={collection.id}
                  onClick={() => navigate('/collections/' + tableEntry.category.id + '/' + collection.id)}
                >
                  <td>{collection.name}</td>
                  {tableEntry.hasLocation && <td>{collection.location}</td>}
                  {tableEntry.hasEvent && <td>{collection.event}</td>}
                  {tableEntry.hasEpisode && <td>{collection.episode}</td>}
                  <td>{collection.reward}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {tableEntry.collections && tableEntry.collections.totalItems !== 0 && (
            <Pagination>
              <Pagination.First onClick={() => fetchCategory(tableEntry, 0)} />
              <Pagination.Prev
                onClick={() =>
                  fetchCategory(
                    tableEntry,
                    tableEntry.collections
                      ? tableEntry.collections.currentPage - 1 >= 0
                        ? tableEntry.collections.currentPage - 1
                        : 0
                      : 0,
                  )
                }
              />
              {[...Array(tableEntry.collections?.totalPages)].map((e, i) => (
                <Pagination.Item
                  key={i}
                  active={tableEntry.collections?.currentPage === i}
                  onClick={() => fetchCategory(tableEntry, i)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  fetchCategory(
                    tableEntry,
                    tableEntry.collections
                      ? tableEntry.collections.currentPage + 1 < tableEntry.collections.totalPages
                        ? tableEntry.collections.currentPage + 1
                        : tableEntry.collections.totalPages - 1
                      : 0,
                  )
                }
              />
              <Pagination.Last
                onClick={() =>
                  fetchCategory(tableEntry, tableEntry.collections ? tableEntry.collections.totalPages - 1 : 0)
                }
              />
            </Pagination>
          )}
        </div>
      ))}
    </>
  );
};
