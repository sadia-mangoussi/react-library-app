import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentChanges } from '../../../services/openLibraryAPI';

function Home() {
  const [recentChanges, setRecentChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentChanges = async () => {
      try {
        const data = await getRecentChanges(30);
        setRecentChanges(data.slice(0, 20));
      } catch (err) {
        setError('Impossible de charger les changements récents');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentChanges();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeType = (kind) => {
    switch(kind) {
      case 'update': return 'Mise à jour';
      case 'new': return 'Nouveau';
      case 'delete': return 'Suppression';
      case 'redirect': return 'Redirection';
      default: return 'Modification';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="page-title">Bienvenue</h1>
        <p className="page-subtitle">Explorez notre collection de livres</p>
        <div className="loading">Chargement des changements récents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="page-title">Bienvenue</h1>
        <p className="page-subtitle">Explorez notre collection de livres</p>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Bienvenue dans la Bibliothèque</h1>
      <p className="page-subtitle">Explorez notre collection et découvrez de nouveaux ouvrages</p>
      
      <div className="recent-changes">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Activité Récente</h2>
        
        {recentChanges.length === 0 ? (
          <div className="empty-state">Aucune activité récente disponible</div>
        ) : (
          <div className="recent-list">
            {recentChanges.map((change, index) => (
              <div key={index} className="recent-item">
                <div className="recent-title">
                  {getChangeType(change.kind)} - {change.comment || 'Modification'}
                </div>
                <div className="recent-meta">
                  {change.author?.key && `${change.author.key.replace('/people/', '')} - `}
                  {formatDate(change.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        background: 'white',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Commencez votre recherche</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Utilisez la barre de recherche en haut pour trouver rapidement un livre, 
          ou accédez à la recherche avancée pour affiner vos critères de recherche.
        </p>
        <Link to="/search" className="btn btn-primary">
          Recherche Avancée
        </Link>
      </div>
    </div>
  );
}

export default Home;
