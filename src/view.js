import onChange from 'on-change';
import local from './localizations.js';

const createListContainer = (title) => {
  const container = document.createElement('div');
  container.setAttribute('class', 'card border-0');
  container.innerHTML = `<div class="card-body"><h2 class="card-title h4">${title}</h2></div>`;
  return container;
};

const createULElement = () => {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group border-0 rounded-0');
  return ul;
};

const createLIElement = (classes) => {
  const li = document.createElement('li');
  if (classes) {
    li.setAttribute('class', classes);
  }
  return li;
};

const createFeedItem = (feed) => {
  const feedItem = createLIElement('list-group-item border-0 border-end-0');

  const feedHeader = document.createElement('h3');
  feedHeader.textContent = feed.title;
  feedHeader.setAttribute('class', 'h6 m-0');

  const feedBody = document.createElement('p');
  feedBody.textContent = feed.description;
  feedBody.setAttribute('class', 'm-0 small text-black-50');

  feedItem.append(feedHeader, feedBody);
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

  const readButton = document.createElement('button');
  readButton.setAttribute('type', 'button');
  readButton.setAttribute('class', 'btn btn-outline-primary btn-sm');
  readButton.setAttribute('data-id', `${postId}`);
  readButton.setAttribute('data-bs-toggle', 'modal');
  readButton.setAttribute('data-bs-target', '#modal');
  readButton.textContent = local.t('form.preview');
  postItem.append(postUrl, readButton);

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
  postElement.classList.replace('fw-bold', 'fw-normal');
};

const changeFeedback = (element, text, styleName) => {
  const el = element;
  const removedClass = styleName === 'success' ? 'text-danger' : 'text-success';
  const addedClass = removedClass === 'text-danger' ? 'text-success' : 'text-danger';
  el.innerHTML = text;
  el.classList.replace(removedClass, addedClass);
};

const handleSubcribeState = (elements, subscribeState) => {
  const domElements = elements;
  switch (subscribeState) {
    case 'added':
      changeFeedback(domElements.feedback, local.t('rssEvents.success'), 'success');
      break;

    case 'sending':
      domElements.submitButton.disabled = true;
      break;

    case 'filling':
      domElements.inputField.value = '';
      domElements.inputField.focus();
      domElements.submitButton.disabled = false;
      break;

    case 'error':
      domElements.submitButton.disabled = false;
      break;

    default:
      throw new Error(`Unknow subscribe state: ${subscribeState}`);
  }
};

const createFeedItems = ({ feed }) => createFeedItem(feed);
function createPostItems({ post, id: postId }) {
  return createPostItem(post, postId, this);
}

const createListWithItems = (listName, stateList, createItems, state = undefined) => {
  const container = createListContainer(listName);
  const list = createULElement();
  const items = stateList.map(createItems, state);

  list.append(...items);
  container.append(list);

  return container;
};

const renderList = (root, {
  state, listName, list, mapFn,
}) => {
  root.replaceChildren();
  const newChildren = createListWithItems(listName, list, mapFn, state);
  root.append(newChildren);
};

const render = (elements, initialState) => (path, value) => {
  switch (path) {
    case 'subscribeProcess.status':
      handleSubcribeState(elements, value);
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
      renderList(
        elements.feedSection,
        {
          listName: local.t('form.feeds'),
          list: initialState.feeds,
          mapFn: createFeedItems,
        },
      );
      break;

    case 'posts':
      renderList(
        elements.postSection,
        {
          listName: local.t('form.posts'),
          list: initialState.posts,
          mapFn: createPostItems,
          state: initialState,
        },
      );
      break;

    case 'selectedPost':
      handleReadButton(initialState, elements);
      break;

    default:
      break;
  }
};

export default (state, elements) => onChange(state, render(elements, state));
