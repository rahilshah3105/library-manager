export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  coverImage?: string;
  addedDate: Date;
  createdBy?: string; // Username of the creator
}

export type BookFormData = Omit<Book, 'id' | 'addedDate'>;
