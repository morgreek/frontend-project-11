import Feed from './Feed';
import FeedPost from './FeedPost';
import xmlParser from './parsers.js';

const parseXML = (xmlData) => {
  const result = new Feed();

  const parsedXMLRss = xmlParser(xmlData);

  result.setTitle(parsedXMLRss.title);
  result.setDescription(parsedXMLRss.description);
  result.replacePosts(parsedXMLRss.posts
    .map((postItem) => new FeedPost(
      postItem.title,
      postItem.description,
      postItem.link,
    )));

  return result;
};

export default parseXML;
