import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            BIBLIOTHÈQUE
          </Link>

          <div className="search-container">
            <form className="search-form" onSubmit={handleQuickSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher un livre ou un auteur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Recherche rapide"
              />
              <button type="submit" className="search-button">
                Rechercher
              </button>
            </form>
          </div>

          <nav className="nav">
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/search" className="nav-link">Recherche Avancée</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
