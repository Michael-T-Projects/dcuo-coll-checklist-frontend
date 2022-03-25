import Collection from './Collection';
import CollectionPart from './CollectionPart';
import User from './User';

export default interface CollectionProgress {
  id: number;
  user: User;
  collection: Collection;
  completedCollectionParts: CollectionPart[];
}
