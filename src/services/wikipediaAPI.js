const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export const getWikipediaSummary = async (title) => {
  if (!title || typeof title !== 'string') {
    return null;
  }

  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title.trim(),
      prop: 'extracts|pageimages',
      exintro: true,
      explaintext: true,
      piprop: 'thumbnail',
      pithumbsize: '400',
      origin: '*'
    });

    const response = await fetch(`${WIKI_API}?${params}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.query || !data.query.pages) {
      return null;
    }
    
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    
    if (!page || page.missing) {
      return null;
    }
    
    return {
      title: page.title || '',
      extract: page.extract || '',
      thumbnail: page.thumbnail?.source || null,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
    };
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
};
