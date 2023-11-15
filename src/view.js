import onChange from 'on-change';
import local from './localizations.js';

const createContainer = (root, title) => {
  const container = document.createElement('div');
  container.setAttribute('class', 'card border-0');
  container.innerHTML = `<div class="card-body"><h2 class="card-title h4">${title}</h2></div>`;
  const ulItem = document.createElement('ul');
  ulItem.setAttribute('class', 'list-group border-0 rounded-0');
  container.append(ulItem);
  root.append(container);
  return ulItem;
};

const createFeedItem = (feed) => {
  const feedItem = document.createElement('li');
  feedItem.setAttribute('class', 'list-group-item border-0 border-end-0');
  const feedHeader = document.createElement('h3');
  feedHeader.textContent = feed.title;
  feedHeader.setAttribute('class', 'h6 m-0');
  feedItem.append(feedHeader);
  const feedBody = document.createElement('p');
  feedBody.textContent = feed.description;
  feedBody.setAttribute('class', 'm-0 small text-black-50');
  feedItem.append(feedBody);
  return feedItem;
};

const createPostItem = (post, postId, state) => {
  const postItem = document.createElement('li');
  postItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');

  const postUrl = document.createElement('a');
  postUrl.setAttribute('href', `${post.getUrl()}`);
  postUrl.setAttribute('data-id', `${postId}`);
  postUrl.setAttribute('target', '_blank');
  postUrl.setAttribute('rel', 'noopener noreferrer');
  postUrl.setAttribute('class', state.readedPostsId.has(postId) ? 'fw-normal' : 'fw-bold');

  postUrl.textContent = post.getTitle();
  postItem.append(postUrl);

  const readButton = document.createElement('button');
  readButton.setAttribute('type', 'button');
  readButton.setAttribute('class', 'btn btn-outline-primary btn-sm');
  readButton.setAttribute('data-id', `${postId}`);
  readButton.setAttribute('data-bs-toggle', 'modal');
  readButton.setAttribute('data-bs-target', '#modal');
  readButton.textContent = local.t('form.preview');
  postItem.append(readButton);

  return postItem;
};

const handleReadButton = (state, elements) => {
  const { modal } = elements;
  const title = modal.querySelector('.modal-title');
  const description = modal.querySelector('.modal-body');
  const linkButton = modal.querySelector('.full-article');
  const closeButton = modal.querySelector('.btn-secondary');

  const selectedPost = state.posts.find((post) => post.id === state.selectedPost);
  title.textContent = selectedPost.post.getTitle();
  description.textContent = selectedPost.post.getDescription();
  linkButton.setAttribute('href', `${selectedPost.post.getUrl()}`);
  linkButton.textContent = local.t('form.read');
  closeButton.textContent = local.t('form.close');
  const postElement = document.querySelector(`[data-id="${selectedPost.id}"]`);
  postElement.classList.remove('fw-bold');
  postElement.classList.add('fw-normal');
};

const changeFeedback = (element, text, styleName) => {
  const removedClass = styleName === 'success' ? 'text-danger' : 'text-success';
  const addedClass = removedClass === 'text-danger' ? 'text-success' : 'text-danger';
  element.innerHTML = text;
  element.classList.remove(removedClass);
  element.classList.add(addedClass);
};

const handleSubcribeState = (elements, subscribeState) => {
  switch (subscribeState) {
    case 'added':
      changeFeedback(elements.feedback, local.t('rssEvents.success'), 'success');
      break;

    case 'sending':
      elements.submitButton.disabled = true;
      break;

    case 'filling':
      elements.inputField.value = '';
      elements.inputField.focus();
      elements.submitButton.disabled = false;
      break;

    case 'error':
      elements.submitButton.disabled = false;
      break;

    default:
      throw new Error(`Unknow subscribe state: ${subscribeState}`);
  }
};

const renderFeeds = (elements, initialState) => {
  elements.feedSection.replaceChildren();
  const feedCont = createContainer(elements.feedSection, local.t('form.feeds'));
  initialState.feeds.forEach(({ feed }) => {
    const feedSet = createFeedItem(feed);
    feedCont.append(feedSet);
  });
};

const renderPosts = (elements, initialState) => {
  elements.postSection.replaceChildren();
  const postCont = createContainer(elements.postSection, local.t('form.posts'));
  initialState.posts.forEach(({ post, id: postId }) => {
    const postSet = createPostItem(post, postId, initialState);
    postCont.append(postSet);
  });
};

const render = (elements, initialState) => (path, value) => {
  switch (path) {
    case 'subscribeProcess.status':
      handleSubcribeState(elements, value);
      break;

    case 'subscribeProcess.error':
      break;

    case 'form.valid':
      if (value) {
        elements.inputField.classList.remove('is-invalid');
      } else {
        elements.inputField.classList.add('is-invalid');
      }
      break;

    case 'form.error':
      if (initialState.form.error) {
        changeFeedback(elements.feedback, initialState.form.error.message, 'danger');
      } else {
        changeFeedback(elements.feedback, '', 'success');
      }
      break;

    case 'feeds':
      renderFeeds(elements, initialState);
      break;

    case 'posts':
      renderPosts(elements, initialState);
      break;

    case 'selectedPost':
      handleReadButton(initialState, elements);
      break;
    default:
      break;``
  }
};

export default (state, elements) => onChange(state, render(elements, state));
