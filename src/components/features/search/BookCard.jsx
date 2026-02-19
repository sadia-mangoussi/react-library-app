import React from 'react';
import { Link } from 'react-router-dom';
import { getCoverUrl, getISBNCoverUrl } from '../../../services/openLibraryAPI';

function BookCard({ book }) {
  const getCover = () => {
    if (book.cover_i) {
      return getCoverUrl(book.cover_i, 'M');
    }
    if (book.isbn && book.isbn[0]) {
      return getISBNCoverUrl(book.isbn[0], 'M');
    }
    return null;
  };

  const coverUrl = getCover();
  const bookId = book.key ? book.key.replace('/works/', '') : '';

  if (!bookId) return null;

  return (
    <Link to={`/book/${bookId}`} className="book-card">
      <div className="book-cover">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={book.title || 'Couverture du livre'} 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span>Couverture non disponible</span>
        )}
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title || 'Titre non disponible'}</h3>
        
        {book.author_name && book.author_name.length > 0 && (
          <p className="book-author">
            {book.author_name.slice(0, 2).join(', ')}
          </p>
        )}
        
        <div className="book-meta">
          {book.first_publish_year && <span>{book.first_publish_year}</span>}
          {book.edition_count && book.edition_count > 1 && (
            <span>{book.edition_count} éditions</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
