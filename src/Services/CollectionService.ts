import axios from 'axios';
import Category from '../Models/Category';
import Collection from '../Models/Collection';
import Page from '../Models/Page';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://dcuo-coll-checklist-backend.herokuapp.com/api/v1'
    : 'http://localhost:8080/api/v1';

class CollectionService {
  private mapper: CollectionMappingService;

  constructor() {
    this.mapper = new CollectionMappingService();
  }

  findAll(page: number, size: number): Promise<Page<Collection>> {
    return axios
      .get<any>(API_URL + '/collections', {
        params: {
          page,
          size,
        },
      })
      .then((response) => ({
        items: response.data.items.map((collection: any) => this.mapper.fromApi(collection)),
        currentPage: response.data['current_page'],
        totalPages: response.data['total_pages'],
        totalItems: response.data['total_items'],
      }));
  }

  findAllCategories(): Promise<Category[]> {
    return axios.get<Category[]>(API_URL + '/categories').then((response) => response.data);
  }

  findByCategoryId(categoryId: number, page: number, size: number): Promise<Page<Collection>> {
    return axios
      .get<any>(API_URL + '/collections', {
        params: {
          category_id: categoryId,
          page,
          size,
        },
      })
      .then((response) => ({
        items: response.data.items.map((collection: any) => this.mapper.fromApi(collection)),
        currentPage: response.data['current_page'],
        totalPages: response.data['total_pages'],
        totalItems: response.data['total_items'],
      }));
  }

  findByNameContainingAndCategoryId(
    name: string,
    page: number,
    size: number,
    categoryId?: number,
  ): Promise<Page<Collection>> {
    return axios
      .get<any>(API_URL + '/collections', {
        params: {
          name,
          category_id: categoryId,
          page,
          size,
        },
      })
      .then((response) => ({
        items: response.data.items.map((collection: any) => this.mapper.fromApi(collection)),
        currentPage: response.data['current_page'],
        totalPages: response.data['total_pages'],
        totalItems: response.data['total_items'],
      }));
  }
}

class CollectionMappingService {
  fromApi(collection: any): Collection {
    const result = Object.assign({}, collection);

    if (result['collection_parts']) {
      result.collectionParts = result['collection_parts'];
      delete result['collection_parts'];
    }

    return result;
  }
}

export default new CollectionService();
