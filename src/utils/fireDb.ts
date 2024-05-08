import { FIRESTORE_DB } from "@/config/firebase";
import { BorrowTransaction } from "@/models/transaction";
import { AppUser } from "@/models/user";
import { Item } from "firebase/analytics";
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, collection } from "firebase/firestore";

const converter = <T = DocumentData>() => ({
  toFirestore: (data: WithFieldValue<Omit<T, "id">>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot, options: SnapshotOptions) => {
    return { id: snap.id, ...snap.data(options)! } as T
  }
})

const getCollection = <T = DocumentData>(collectionName: string) => {
  return collection(FIRESTORE_DB, collectionName).withConverter(converter<T>())
}

const db = {
  users: getCollection<AppUser>('users'),
  items: getCollection<Item>('items'),
  transactions: getCollection<BorrowTransaction>('transactions'),
}
export { db };
export default db
