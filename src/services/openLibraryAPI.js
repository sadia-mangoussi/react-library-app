const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b';

export const searchBooks = async (query, page = 1, limit = 20) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      docs: data.docs || [],
      numFound: data.numFound || 0
    };
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const searchBooksAdvanced = async (params) => {
  const queryParts = [];
  
  if (params.title) queryParts.push(`title=${encodeURIComponent(params.title)}`);
  if (params.author) queryParts.push(`author=${encodeURIComponent(params.author)}`);
  if (params.subject) queryParts.push(`subject=${encodeURIComponent(params.subject)}`);
  if (params.publisher) queryParts.push(`publisher=${encodeURIComponent(params.publisher)}`);
  if (params.year) queryParts.push(`first_publish_year=${params.year}`);
  
  if (queryParts.length === 0) {
    throw new Error('At least one search parameter is required');
  }
  
  const queryString = queryParts.join('&');
  const page = params.page || 1;
  const limit = params.limit || 20;

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?${queryString}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      docs: data.docs || [],
      numFound: data.numFound || 0
    };
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
};

export const getBookByKey = async (key) => {
  if (!key) {
    throw new Error('Book key is required');
  }

  try {
    const response = await fetch(`${BASE_URL}${key}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

export const getAuthorByKey = async (key) => {
  if (!key) {
    throw new Error('Author key is required');
  }

  try {
    const response = await fetch(`${BASE_URL}${key}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching author details:', error);
    throw error;
  }
};

export const getRecentChanges = async (limit = 50) => {
  try {
    const response = await fetch(`${BASE_URL}/recentchanges/edit-book.json?limit=${limit}&bot=false`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    throw error;
  }
};

export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  const validSizes = ['S', 'M', 'L'];
  const finalSize = validSizes.includes(size) ? size : 'M';
  return `${COVERS_URL}/id/${coverId}-${finalSize}.jpg`;
};

export const getISBNCoverUrl = (isbn, size = 'M') => {
  if (!isbn) return null;
  const validSizes = ['S', 'M', 'L'];
  const finalSize = validSizes.includes(size) ? size : 'M';
  return `${COVERS_URL}/isbn/${isbn}-${finalSize}.jpg`;
};
