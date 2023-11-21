import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import stateView from './view.js';
import validator from './validator.js';
import rssParsers from './rssParsers.js';
import local from './localizations.js';
import makeProxy from './proxy.js';

function app() {
  const initialState = {
    subscribeProcess: {
      status: 'filling',
    },
    form: {
      valid: true,
      error: null,
    },
    feeds: [],
    posts: [],
    readedPostsId: new Set(),
    selectedPost: null,
  };

  const elements = {
    form: document.querySelector('form'),
    inputField: document.querySelector('#url-input'),
    submitButton: document.querySelector('button[type="submit"'),
    feedback: document.querySelector('.feedback'),
    postSection: document.querySelector('.posts'),
    feedSection: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };

  const state = stateView(initialState, elements);

  const getData = (url) => {
    const proxyUrl = makeProxy(url);
    return axios
      .get(`${proxyUrl.toString()}`)
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
          state.posts = [...newPosts, ...state.posts];
          return Promise.resolve();
        })
        .catch(() => Promise.resolve());
    });

    Promise.all(promises)
      .then(setTimeout(() => autoUpdaterRss(), 5000));
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    state.form.error = null;
    state.subscribeProcess.error = null;
    state.subscribeProcess.status = 'sending';

    let savedUrl;
    const rssList = state.feeds.map((feedItem) => feedItem.feed.getRssLink());
    validator(elements.inputField.value, rssList)
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
        const newPosts = feed.getPosts().map((post) => ({ id: _.uniqueId('post_'), post, feedId: feedState.id }));
        state.posts = [...newPosts, ...state.posts];
        state.form.valid = true;
        state.subscribeProcess.status = 'added';
        return Promise.resolve();
      })
      .then(() => {
        state.subscribeProcess.status = 'filling';
      })
      .catch((error) => {
        state.form.valid = false;
        state.form.error = error;
        if (error.details) {
          console.log(error.details);
        }
      });
  });

  elements.postSection.addEventListener('click', (e) => {
    state.selectedPost = e.target.dataset.id;
    state.readedPostsId.add(e.target.dataset.id);
  });

  autoUpdaterRss();
}

export default app;
