export default (xmlData) => {
  const domParser = new DOMParser();
  return domParser.parseFromString(xmlData, 'application/xml');
};
