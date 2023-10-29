import onChange from 'on-change';

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
                changeFeedback(elements.feedback, '', 'success');
            } else {
                elements.inputField.classList.add('is-invalid');
            }
            break;
        
        case 'mainForm.error':
            changeFeedback(elements.feedback, initialState.mainForm.error, 'danger');
            break;
        
        default:
            break;
        
    }
}

export default (state, elements) => onChange(state, render(elements, state));