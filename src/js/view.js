import onChange from 'on-change';

const createContainer = (root, title) => {
    const container = document.createElement('div');
    container.setAttribute('class', 'card border-0');
    container.innerHTML = `<div class="card-body"><h2 class="card-title h4">${title}</h2></div>`;
    const ulItem = document.createElement('ul');
    ulItem.setAttribute('class', 'list-group border-0 rounded-0');
    container.append(ulItem);
    root.append(container);
    return ulItem;
}

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
}

const createPostItem = (post) => {
    const postItem = document.createElement('li');
    postItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
    const postUrl = document.createElement('a');
    postUrl.setAttribute('href', `${post.getUrl()}`);
    postUrl.setAttribute('target', '_blank');
    postUrl.setAttribute('rel', 'noopener noreferrer');
    postUrl.setAttribute('class', 'fw-bold');
    postUrl.textContent = post.getTitle();
    postItem.append(postUrl);
    return postItem;
}

const changeFeedback = (element, text, styleName) => {
    const removedClass = styleName === 'success' ? 'text-danger' : 'text-success';
    const addedClass = removedClass === 'text-danger' ? 'text-success' : 'text-danger';
    element.innerHTML = text;
    element.classList.remove(removedClass);
    element.classList.add(addedClass); 
}

const handleSubcribeState = (elements, subscribeState) => {
    switch(subscribeState) {
        case 'added':
            changeFeedback(elements.feedback, 'RSS успешно добавлен', 'success');
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
}

const render = (elements, initialState) => (path, value, previousValue) => {
    switch(path) {
        case 'subscribeProcess.status':
            handleSubcribeState(elements, value);
            break;

        case 'subscribeProcess.error':
            break;

        case 'mainForm.valid':
            if (value) {
                elements.inputField.classList.remove('is-invalid');
            } else {
                elements.inputField.classList.add('is-invalid');
            }
            break;
        
        case 'mainForm.error':
            if (initialState.mainForm.error) {
                changeFeedback(elements.feedback, initialState.mainForm.error.message, 'danger');
            } else {
                changeFeedback(elements.feedback, '', 'success');
            }
            break;

        case 'feeds':
            elements.feedSection.replaceChildren();
            const feedCont = createContainer(elements.feedSection, 'Фиды');
            initialState.feeds.forEach((feed) => {
                const feedSet = createFeedItem(feed);
                feedCont.append(feedSet);
            });
            break;

        case 'posts':
            elements.postSection.replaceChildren();
            const postCont = createContainer(elements.postSection, 'Посты');
            initialState.posts.forEach((post) => {
                const postSet = createPostItem(post);
                postCont.append(postSet);
            })
            break;
        default:
            break;
        
    }
}

export default (state, elements) => onChange(state, render(elements, state));