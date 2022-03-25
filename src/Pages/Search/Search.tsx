import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Collection from '../../Models/Collection';
import Page from '../../Models/Page';
import CollectionService from '../../Services/CollectionService';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Page<Collection>>();
  const [query, setQuery] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>();

  const fetchData = async (query: string, categoryId: string | null, page: number, size: number) => {
    const fetchedCollections = await CollectionService.findByNameContainingAndCategoryId(
      query.trim(),
      page,
      size,
      categoryId ? +categoryId : undefined,
    );

    setCollections(fetchedCollections);
  };

  useEffect(() => {
    const query = searchParams.get('query');
    const categoryId = searchParams.get('category');

    if (!query) {
      navigate('/collections');
    } else {
      setQuery(query);
      setCategoryId(categoryId ? categoryId : undefined);

      fetchData(query, categoryId, 0, 10);
    }
  }, [searchParams]);

  return (
    <>
      <h1>Search Results</h1>
      {collections && (
        <>
          <p>{collections.totalItems} results</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Category</td>
                <td>Name</td>
                <td>Location</td>
                <td>Event</td>
                <td>Episode</td>
                <td>Reward</td>
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
                  <td>{collection.location ? collection.location : ''}</td>
                  <td>{collection.event ? collection.event : ''}</td>
                  <td>{collection.episode ? collection.episode : ''}</td>
                  <td>{collection.reward}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {collections.totalItems !== 0 && (
            <Pagination>
              <Pagination.First onClick={() => fetchData(query ? query : '', categoryId ? categoryId : null, 0, 10)} />
              <Pagination.Prev
                onClick={() =>
                  fetchData(
                    query ? query : '',
                    categoryId ? categoryId : null,
                    collections.currentPage - 1 >= 0 ? collections.currentPage - 1 : 0,
                    10,
                  )
                }
              />
              {[...Array(collections.totalPages)].map((e, i) => (
                <Pagination.Item
                  key={i}
                  active={collections.currentPage === i}
                  onClick={() => fetchData(query ? query : '', categoryId ? categoryId : null, i, 10)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  fetchData(
                    query ? query : '',
                    categoryId ? categoryId : null,
                    collections.currentPage + 1 < collections.totalPages
                      ? collections.currentPage + 1
                      : collections.totalPages - 1,
                    10,
                  )
                }
              />
              <Pagination.Last
                onClick={() =>
                  fetchData(query ? query : '', categoryId ? categoryId : null, collections.totalPages - 1, 10)
                }
              />
            </Pagination>
          )}
        </>
      )}
    </>
  );
};
