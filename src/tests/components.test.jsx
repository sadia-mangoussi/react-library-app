import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BookCard from '../components/features/search/BookCard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  it('should render logo and search bar', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('BIBLIOTHÈQUE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Rechercher/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Recherche Avancée')).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('should render footer content', () => {
    render(<Footer />);
    expect(screen.getByText(/Bibliothèque/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Library/i)).toBeInTheDocument();
  });
});

describe('BookCard Component', () => {
  const mockBook = {
    key: '/works/OL123W',
    title: 'Test Book',
    author_name: ['Test Author'],
    first_publish_year: 2020,
    edition_count: 5,
    cover_i: 123456
  };

  it('should render book information', () => {
    renderWithRouter(<BookCard book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
  });

  it('should display placeholder when no cover available', () => {
    const bookWithoutCover = { ...mockBook, cover_i: null, isbn: null };
    renderWithRouter(<BookCard book={bookWithoutCover} />);
    expect(screen.getByText('Couverture non disponible')).toBeInTheDocument();
  });
});
