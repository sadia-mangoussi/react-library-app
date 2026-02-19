import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooks, searchBooksAdvanced } from '../../../services/openLibraryAPI';
import BookCard from './BookCard';

function AdvancedSearch() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    subject: '',
    publisher: '',
    year: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const quickQuery = searchParams.get('q');
    if (quickQuery) {
      performQuickSearch(quickQuery);
    }
  }, [searchParams]);

  const performQuickSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchBooks(query, 1, 30);
      setResults(data.docs || []);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la recherche');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasAnyField = Object.values(formData).some(val => val.trim() !== '');
    if (!hasAnyField) {
      setError('Veuillez remplir au moins un champ de recherche');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchBooksAdvanced(formData);
      setResults(data.docs || []);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la recherche');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      subject: '',
      publisher: '',
      year: ''
    });
    setResults([]);
    setError(null);
    setSearched(false);
  };

  return (
    <div>
      <h1 className="page-title">Recherche Avancée</h1>
      <p className="page-subtitle">Affinez votre recherche avec plusieurs critères</p>

      <div className="search-section">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Harry Potter"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author" className="form-label">Auteur</label>
              <input
                type="text"
                id="author"
                name="author"
                className="form-input"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Ex: J.K. Rowling"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Sujet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-input"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Ex: Fantasy"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publisher" className="form-label">Éditeur</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                className="form-input"
                value={formData.publisher}
                onChange={handleInputChange}
                placeholder="Ex: Penguin Books"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year" className="form-label">Année</label>
              <input
                type="number"
                id="year"
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="Ex: 2020"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recherche en cours...' : 'Rechercher'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Recherche en cours...</div>}

      {!loading && searched && (
        <div>
          <div className="results-header">
            <div className="results-count">
              {results.length} {results.length !== 1 ? 'résultats trouvés' : 'résultat trouvé'}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              Aucun résultat trouvé. Essayez avec d'autres critères de recherche.
            </div>
          ) : (
            <div className="books-grid">
              {results.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
