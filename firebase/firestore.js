import firebasedb from './firebasedb';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(firebasedb.firebaseApp);
export default db;
