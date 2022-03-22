import Category from './Category';
import CollectionPart from './CollectionPart';

export default interface Collection {
  id: number;
  name: string;
  reward: string;
  location?: string;
  event?: string;
  episode?: string;
  category: Category;
  collectionParts: CollectionPart[];
}
