export default (url) => {
  const baseURL = new URL('https://allorigins.hexlet.app/');

  baseURL.pathname = '/get';
  const data = new URLSearchParams({
    disableCache: true,
    url,
  });

  const requestURL = new URL(`${baseURL.origin}${baseURL.pathname}?${data.toString()}`);

  return requestURL;
};
