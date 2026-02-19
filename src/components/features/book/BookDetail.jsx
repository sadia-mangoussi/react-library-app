import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByKey, getAuthorByKey, getCoverUrl } from '../../../services/openLibraryAPI';
import { getWikipediaSummary } from '../../../services/wikipediaAPI';

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [wikiInfo, setWikiInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookData = await getBookByKey(`/works/${bookId}`);
        setBook(bookData);

        if (bookData.authors && bookData.authors.length > 0) {
          const authorsPromises = bookData.authors.map(author => 
            getAuthorByKey(author.author.key).catch(() => null)
          );
          const authorsData = await Promise.all(authorsPromises);
          const validAuthors = authorsData.filter(a => a !== null);
          setAuthors(validAuthors);

          if (validAuthors.length > 0 && validAuthors[0].name) {
            const wikiData = await getWikipediaSummary(validAuthors[0].name);
            if (wikiData) {
              setWikiInfo(wikiData);
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Impossible de charger les détails du livre');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (loading) {
    return <div className="loading">Chargement des détails du livre...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!book) {
    return <div className="error">Livre non trouvé</div>;
  }

  const coverUrl = book.covers && book.covers[0] ? getCoverUrl(book.covers[0], 'L') : null;
  const description = typeof book.description === 'string' 
    ? book.description 
    : book.description?.value;

  return (
    <div>
      <h1 className="page-title">{book.title}</h1>
      {authors.length > 0 && (
        <p className="page-subtitle">
          Par {authors.map(a => a.name).join(', ')}
        </p>
      )}

      <div className="book-detail">
        <div>
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={book.title} 
              className="book-detail-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="book-detail-cover" style={{ 
              aspectRatio: '2/3', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'var(--ivory)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}>
              Couverture non disponible
            </div>
          )}
        </div>

        <div className="book-detail-info">
          {description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{description}</p>
            </div>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <div className="detail-section">
              <h3>Sujets</h3>
              <p>{book.subjects.slice(0, 10).join(', ')}</p>
            </div>
          )}

          {book.first_publish_date && (
            <div className="detail-section">
              <h3>Première Publication</h3>
              <p>{book.first_publish_date}</p>
            </div>
          )}

          {authors.length > 0 && authors[0].birth_date && (
            <div className="detail-section">
              <h3>Auteur</h3>
              <p>
                {authors[0].name}
                {authors[0].birth_date && (
                  <span> ({authors[0].birth_date}
                  {authors[0].death_date && ` - ${authors[0].death_date}`})</span>
                )}
              </p>
            </div>
          )}

          {wikiInfo && wikiInfo.extract && (
            <div className="wikipedia-section">
              <div className="wikipedia-header">Informations Wikipedia</div>
              {wikiInfo.thumbnail && (
                <img 
                  src={wikiInfo.thumbnail} 
                  alt={wikiInfo.title}
                  style={{ 
                    maxWidth: '200px', 
                    float: 'right', 
                    marginLeft: '1.5rem',
                    marginBottom: '1rem',
                    borderRadius: '2px'
                  }}
                />
              )}
              <div className="wikipedia-content">{wikiInfo.extract}</div>
              <a 
                href={wikiInfo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="wikipedia-link"
              >
                Lire la suite sur Wikipedia
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
