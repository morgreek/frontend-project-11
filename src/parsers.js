import local from './localizations.js';

export default (xmlData) => {
  const domParser = new DOMParser();
  const parsedData = domParser.parseFromString(xmlData, 'application/xml');

  if (parsedData.querySelector('parsererror')) {
    const error = new Error(local.t('rssEvents.notValidRSS'));
    error.details = `parsererror: ${parsedData.querySelector('parsererror').textContent}`;

    throw error;
  }

  const feedTitle = parsedData.querySelector('title').textContent;
  const feedDescription = parsedData.querySelector('description').textContent;
  const feedPosts = [...parsedData.querySelectorAll('item')]
    .map((postItem) => ({
      title: postItem.querySelector('title').textContent,
      description: postItem.querySelector('description').textContent,
      link: postItem.querySelector('link').textContent,
    }));

  return {
    title: feedTitle,
    description: feedDescription,
    posts: feedPosts,
  };
};
