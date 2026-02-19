import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks, searchBooksAdvanced, getCoverUrl } from '../services/openLibraryAPI';
import { getWikipediaSummary } from '../services/wikipediaAPI';

global.fetch = vi.fn();

describe('Open Library API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should search for books successfully', async () => {
    const mockResponse = {
      docs: [{ title: 'Test Book', author_name: ['Test Author'] }],
      numFound: 1
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await searchBooks('test');
    expect(result.docs).toHaveLength(1);
    expect(result.docs[0].title).toBe('Test Book');
  });

  it('should perform advanced search', async () => {
    const mockResponse = {
      docs: [{ title: 'Advanced Book' }],
      numFound: 1
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const params = { title: 'advanced', author: 'author' };
    const result = await searchBooksAdvanced(params);
    expect(result.docs).toHaveLength(1);
  });

  it('should generate cover URL', () => {
    const url = getCoverUrl(123456, 'M');
    expect(url).toBe('https://covers.openlibrary.org/b/id/123456-M.jpg');
  });

  it('should return null for missing cover ID', () => {
    const url = getCoverUrl(null);
    expect(url).toBeNull();
  });
});

describe('Wikipedia API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch Wikipedia summary', async () => {
    const mockResponse = {
      query: {
        pages: {
          '123': {
            title: 'Test Article',
            extract: 'Test extract',
            thumbnail: { source: 'https://example.com/image.jpg' }
          }
        }
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await getWikipediaSummary('Test Article');
    expect(result.title).toBe('Test Article');
    expect(result.extract).toBe('Test extract');
  });

  it('should handle Wikipedia errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await getWikipediaSummary('Invalid');
    expect(result).toBeNull();
  });
});
