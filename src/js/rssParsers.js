import Feed from './Feed';
import FeedPost from './FeedPost';
import xmlParser from './parsers.js';
import local from './localizations.js';

const parseXML = (data) => {
  const result = new Feed();

  const parsedData = xmlParser(data);
  if (parsedData.querySelector('parsererror')) {
    throw new Error(local.t('rssEvents.notValidRSS'));
  }
  result.setTitle(parsedData.querySelector('title').textContent);
  result.setDescription(parsedData.querySelector('description').textContent);

  result.replacePosts([...parsedData.querySelectorAll('item')]
    .map((item) => new FeedPost(
      item.querySelector('title').textContent,
      item.querySelector('description').textContent,
      item.querySelector('link').textContent,
    )));

  return result;
};

export default parseXML;
