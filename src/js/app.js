import stateView from './view.js';
import validator from './validator.js';
import axios from 'axios';
import rssParsers from './rssParsers.js';

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
        rssList: [],
        feeds: [],
        posts: [],
        error: null,
    };

    const elements = {
        mainForm: document.querySelector('form'),
        inputField: document.querySelector('#url-input'),
        submitButton: document.querySelector('button[type="submit"'),
        feedback: document.querySelector('.feedback'),
        postSection: document.querySelector('.posts'),
        feedSection: document.querySelector('.feeds'),
    }

    const state = stateView(initialState, elements);

    const getData = (url) => {
        const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url='
        return axios.get(`${allOrigins}${encodeURIComponent(url)}`);
    }

    const autoUpdaterRss = () => {
        const promises = state.rssList.map((rss) => {
            return getData(rss)
                .then((responseData) => {
                    if (!responseData.data) return Promise.resolve();
                    const feed = rssParsers(responseData.data.contents);
                    const updatedPosts = feed.getPosts();
                    let filteredPosts;
                    if (state.posts.length > 0) {
                        const oldUrls = state.posts.map((oldPost) => oldPost.getUrl());
                        filteredPosts = updatedPosts.filter((post) => !oldUrls.includes(post.getUrl()));
                    } else {
                        filteredPosts = newPosts;
                    }
                    if (filteredPosts.length > 0) {
                        state.posts = state.posts.concat(filteredPosts);
                    }
                    return Promise.resolve();
                });
        });

        Promise.all(promises)
            .then(setTimeout(() => autoUpdaterRss(), 5000))
    }

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
        validator(state.mainForm.fields.url, state.rssList)
            .then((validatedUrl) => {
                savedUrl = validatedUrl.rssUrl;
                state.subscribeProcess.status = 'sending';
                return getData(savedUrl);
            })
            .then((responseData) => {
                const feed = rssParsers(responseData.data.contents);
                state.rssList.push(savedUrl);
                state.feeds.push(feed.getFeedInfo())
                state.posts = state.posts.concat(feed.getPosts())
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

    autoUpdaterRss();
}

export default app;