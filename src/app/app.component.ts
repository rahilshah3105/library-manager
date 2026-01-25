import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { AuthService, UserRole } from './services/auth.service';
import { Book, BookFormData } from './models/book.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Library Management System';
  isDarkMode = false;

  // Authentication
  showLoginDialog = false;
  loginUsername = '';
  loginPassword = '';
  loginError = '';

  // Book list and display
  books: Book[] = [];
  filteredBooks: Book[] = [];

  // Form data
  bookForm: BookFormData = this.getEmptyForm();
  isEditing = false;
  editingId: string | null = null;

  // Search and filter
  searchQuery = '';
  selectedGenre = 'all';
  availableGenres: string[] = [];

  // UI states
  showForm = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private libraryService: LibraryService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadThemePreference();
  }

  loadBooks(): void {
    this.books = this.libraryService.getAllBooks();
    this.filteredBooks = [...this.books];
    this.availableGenres = this.libraryService.getGenres();
  }

  loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSearch(): void {
    if (!this.searchQuery.trim() && this.selectedGenre === 'all') {
      this.filteredBooks = [...this.books];
      return;
    }

    let results = this.libraryService.searchBooks(this.searchQuery);

    if (this.selectedGenre !== 'all') {
      results = results.filter(book => book.genre === this.selectedGenre);
    }

    this.filteredBooks = results;
  }

  onFilterByGenre(): void {
    this.onSearch();
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.bookForm.title.trim()) {
      this.formErrors['title'] = 'Title is required';
      isValid = false;
    }

    if (!this.bookForm.author.trim()) {
      this.formErrors['author'] = 'Author is required';
      isValid = false;
    }

    if (!this.bookForm.isbn.trim()) {
      this.formErrors['isbn'] = 'ISBN is required';
      isValid = false;
    } else if (!/^\d{3}-\d-\d{2}-\d{6}-\d$/.test(this.bookForm.isbn) && !/^\d{13}$/.test(this.bookForm.isbn)) {
      this.formErrors['isbn'] = 'ISBN must be in format XXX-X-XX-XXXXXX-X or 13 digits';
      isValid = false;
    }

    if (!this.bookForm.publishedYear) {
      this.formErrors['publishedYear'] = 'Published year is required';
      isValid = false;
    } else {
      const year = Number(this.bookForm.publishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1000 || year > currentYear) {
        this.formErrors['publishedYear'] = `Year must be between 1000 and ${currentYear}`;
        isValid = false;
      }
    }

    if (!this.bookForm.genre.trim()) {
      this.formErrors['genre'] = 'Genre is required';
      isValid = false;
    }

    if (!this.bookForm.description.trim()) {
      this.formErrors['description'] = 'Description is required';
      isValid = false;
    } else if (this.bookForm.description.trim().length < 10) {
      this.formErrors['description'] = 'Description must be at least 10 characters';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    if (this.isEditing && this.editingId) {
      this.libraryService.updateBook(this.editingId, this.bookForm);
    } else {
      // Link book to current user
      const bookToAdd = {
        ...this.bookForm,
        createdBy: this.authService.getUsername()
      };
      this.libraryService.addBook(bookToAdd);
    }

    this.loadBooks();
    this.onSearch();
    this.resetForm();
    this.showForm = false;
  }

  // Only the creator can edit/delete their books
  canEdit(book: Book): boolean {
    return book.createdBy === this.authService.getUsername();
  }

  editBook(book: Book): void {
    if (!this.canEdit(book)) return;
    this.isEditing = true;
    this.editingId = book.id;
    this.bookForm = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      genre: book.genre,
      description: book.description,
      coverImage: book.coverImage
    };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBook(id: string): void {
    const book = this.books.find(b => b.id === id);
    if (!book || !this.canEdit(book)) return;

    if (confirm('Are you sure you want to delete this book?')) {
      this.libraryService.deleteBook(id);
      this.loadBooks();
      this.onSearch();
    }
  }

  resetForm(): void {
    this.bookForm = this.getEmptyForm();
    this.isEditing = false;
    this.editingId = null;
    this.formErrors = {};
  }

  cancelForm(): void {
    this.resetForm();
    this.showForm = false;
  }

  filterBooks(): void {
    this.onSearch();
  }

  // Authentication methods
  openLoginDialog(): void {
    this.showLoginDialog = true;
    this.loginUsername = '';
    this.loginPassword = '';
    this.loginError = '';
  }

  closeLoginDialog(): void {
    this.showLoginDialog = false;
    this.loginError = '';
  }

  handleLogin(): void {
    this.loginError = '';

    if (!this.loginUsername.trim() || !this.loginPassword.trim()) {
      this.loginError = 'Please enter both username and password';
      return;
    }

    const success = this.authService.login(this.loginUsername.trim(), this.loginPassword);

    if (success) {
      this.showLoginDialog = false;
      this.loginUsername = '';
      this.loginPassword = '';
      // Auto-open form as per "Publish Book" workflow
      this.showForm = true;
    } else {
      this.loginError = 'Invalid credentials';
    }
  }

  handleLogout(): void {
    this.authService.logout();
    this.showForm = false;
    this.resetForm();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Admin Statistics
  get totalBooks(): number {
    return this.books.length;
  }

  get booksByGenre(): { genre: string; count: number }[] {
    const genreMap = new Map<string, number>();
    this.books.forEach(book => {
      genreMap.set(book.genre, (genreMap.get(book.genre) || 0) + 1);
    });
    return Array.from(genreMap.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }

  get recentBooks(): Book[] {
    return [...this.books]
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      .slice(0, 5);
  }

  get totalAuthors(): number {
    const authors = new Set(this.books.map(book => book.author));
    return authors.size;
  }

  // User catalog - book detail view
  selectedBook: Book | null = null;

  viewBookDetail(book: Book): void {
    this.selectedBook = book;
  }

  closeBookDetail(): void {
    this.selectedBook = null;
  }

  // Featured books for user view
  get featuredBooks(): Book[] {
    return this.recentBooks.slice(0, 4);
  }

  getEmptyForm(): BookFormData {
    return {
      title: '',
      author: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      genre: '',
      description: '',
      coverImage: ''
    };
  }

  getBookCover(book: Book): string {
    if (book.coverImage && book.coverImage.trim()) {
      return book.coverImage;
    }

    // Generate a color based on the book title for variety
    const colors = ['6366f1', '8b5cf6', 'ec4899', '3b82f6', '10b981', 'f59e0b'];
    const colorIndex = book.title.length % colors.length;
    const color = colors[colorIndex];

    // Use a placeholder service with a book-like image
    return `https://placehold.co/300x450/${color}/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`;
  }
}
