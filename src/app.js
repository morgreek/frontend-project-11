import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import stateView from './view.js';
import validator from './validator.js';
import rssParsers from './rssParsers.js';
import local from './localizations.js';

function app() {
  const initialState = {
    subscribeProcess: {
      status: 'filling',
      error: null,
    },
    mainForm: {
      valid: true,
      error: null,
      fields: {
        url: '',
      },
    },
    feeds: [],
    posts: [],
    readedPostsId: new Set(),
    clickOnPost: null,
    error: null,
  };

  const elements = {
    mainForm: document.querySelector('form'),
    inputField: document.querySelector('#url-input'),
    submitButton: document.querySelector('button[type="submit"'),
    feedback: document.querySelector('.feedback'),
    postSection: document.querySelector('.posts'),
    feedSection: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };

  const state = stateView(initialState, elements);

  const getData = (url) => {
    const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
    return axios
      .get(`${allOrigins}${encodeURIComponent(url)}`)
      .catch(() => {
        throw new Error(local.t('networks.error'));
      });
  };

  const autoUpdaterRss = () => {
    const promises = state.feeds.map((feedState) => {
      const feedId = feedState.id;
      return getData(feedState.feed.getRssLink())
        .then((responseData) => {
          const feed = rssParsers(responseData.data.contents);
          const existsUrls = state.posts
            .filter((item) => item.feedId === feedId)
            .map((item) => item.post.getUrl());
          const newPosts = feed
            .getPosts()
            .filter((post) => !existsUrls.includes(post.getUrl()))
            .map((newPost) => ({ id: _.uniqueId('post_'), post: newPost, feedId }));
          if (!newPosts) return Promise.resolve();
          state.posts = state.posts.concat(newPosts);
          return Promise.resolve();
        })
        .catch(() => Promise.resolve());
    });

    Promise.all(promises)
      .then(setTimeout(() => autoUpdaterRss(), 5000));
  };

  elements.inputField.addEventListener('input', (e) => {
    const { value: content } = e.target;
    state.mainForm.fields.url = content;
  });

  elements.mainForm.addEventListener('submit', (e) => {
    e.preventDefault();

    state.mainForm.error = null;
    state.subscribeProcess.error = null;
    state.subscribeProcess.status = 'sending';

    let savedUrl;
    const rssList = state.feeds.map((feedItem) => feedItem.feed.getRssLink());
    validator(state.mainForm.fields.url, rssList)
      .then((validatedUrl) => {
        savedUrl = validatedUrl.rssUrl;
        state.subscribeProcess.status = 'sending';
        return getData(savedUrl);
      })
      .then((responseData) => {
        const feed = rssParsers(responseData.data.contents);
        feed.setRssLink(savedUrl);
        const feedState = { id: _.uniqueId('feed_'), feed };
        state.feeds.push(feedState);
        state.posts = state.posts.concat(feed.getPosts().map((post) => ({ id: _.uniqueId('post_'), post, feedId: feedState.id })));
        state.mainForm.valid = true;
        state.subscribeProcess.status = 'added';
        return Promise.resolve();
      })
      .then(() => {
        state.subscribeProcess.status = 'filling';
      })
      .catch((error) => {
        state.subscribeProcess.status = 'error';
        state.mainForm.valid = false;
        state.mainForm.error = error;
      });
  });

  elements.postSection.addEventListener('click', (e) => {
    state.clickOnPost = e.target.dataset.id;
    state.readedPostsId.add(e.target.dataset.id);
  });

  autoUpdaterRss();
}

export default app;
