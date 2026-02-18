import { Injectable } from '@angular/core';
import { Book, BookFormData } from '../models/book.model';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    private readonly STORAGE_KEY = 'library_books';
    private books: Book[] = [];

    constructor(private logger: LoggerService) {
        this.logger.info('LibraryService initialized');
        this.loadBooks();
    }

    private loadBooks(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.books = JSON.parse(stored);
            this.logger.debug('Books loaded from storage', { count: this.books.length });
        } else {
            this.books = this.getSampleData();
            this.saveBooks();
            this.logger.info('Initialized with sample data', { count: this.books.length });
        }
    }

    private saveBooks(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.books));
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBookById(id: string): Book | undefined {
        return this.books.find(book => book.id === id);
    }

    addBook(bookData: BookFormData): Book {
        const newBook: Book = {
            ...bookData,
            id: this.generateId(),
            addedDate: new Date()
        };
        this.books.unshift(newBook);
        this.saveBooks();
        this.logger.info('Book added', { id: newBook.id, title: newBook.title });
        return newBook;
    }

    updateBook(id: string, bookData: Partial<BookFormData>): Book | null {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...bookData };
            this.saveBooks();
            this.logger.info('Book updated', { id, title: this.books[index].title });
            return this.books[index];
        }
        this.logger.warn('Book update failed: Book not found', { id });
        return null;
    }

    deleteBook(id: string): boolean {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            const title = this.books[index].title;
            this.books.splice(index, 1);
            this.saveBooks();
            this.logger.info('Book deleted', { id, title });
            return true;
        }
        this.logger.warn('Book deletion failed: Book not found', { id });
        return false;
    }

    searchBooks(query: string): Book[] {
        if (!query.trim()) {
            return this.getAllBooks();
        }
        const lowerQuery = query.toLowerCase();
        return this.books.filter(book =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.genre.toLowerCase().includes(lowerQuery) ||
            book.isbn.includes(lowerQuery)
        );
    }

    filterByGenre(genre: string): Book[] {
        if (!genre || genre === 'all') {
            return this.getAllBooks();
        }
        return this.books.filter(book => book.genre === genre);
    }

    getGenres(): string[] {
        const genres = new Set(this.books.map(book => book.genre));
        return Array.from(genres).sort();
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private getSampleData(): Book[] {
        return [
            {
                id: '1',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                publishedYear: 1925,
                genre: 'Classic',
                description: 'A classic novel set in the Jazz Age that explores themes of decadence, idealism, and social upheaval.',
                addedDate: new Date('2024-01-15'),
                createdBy: 'Admin'
            },
            {
                id: '2',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '978-0-06-112008-4',
                publishedYear: 1960,
                genre: 'Classic',
                description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
                addedDate: new Date('2024-01-16'),
                createdBy: 'Admin'
            },
            {
                id: '3',
                title: 'Dune',
                author: 'Frank Herbert',
                isbn: '978-0-441-17271-9',
                publishedYear: 1965,
                genre: 'Science Fiction',
                description: 'An epic science fiction novel about politics, religion, and ecology on the desert planet Arrakis.',
                addedDate: new Date('2024-01-17'),
                createdBy: 'Admin'
            },
            {
                id: '4',
                title: 'The Hobbit',
                author: 'J.R.R. Tolkien',
                isbn: '978-0-547-92822-7',
                publishedYear: 1937,
                genre: 'Fantasy',
                description: 'A fantasy adventure about Bilbo Baggins and his unexpected journey with dwarves and a wizard.',
                addedDate: new Date('2024-01-18'),
                createdBy: 'Admin'
            },
            {
                id: '5',
                title: '1984',
                author: 'George Orwell',
                isbn: '978-0-452-28423-4',
                publishedYear: 1949,
                genre: 'Dystopian',
                description: 'A dystopian social science fiction novel about totalitarianism and surveillance.',
                addedDate: new Date('2024-01-19'),
                createdBy: 'Admin'
            },
            {
                id: '6',
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                isbn: '978-0-14-143951-8',
                publishedYear: 1813,
                genre: 'Romance',
                description: 'A romantic novel of manners set in Georgian England.',
                addedDate: new Date('2024-01-20'),
                createdBy: 'Admin'
            }
        ];
    }
}
