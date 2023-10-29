import stateView from './view.js';
import validator from './validator.js';

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
        posts: [],
    };

    const elements = {
        mainForm: document.querySelector('form'),
        inputField: document.querySelector('#url-input'),
        submitButton: document.querySelector('button[type="submit"'),
        feedback: document.querySelector('.feedback'),
    }

    const state = stateView(initialState, elements);

    elements.inputField.addEventListener('input', (e) => {
        const { value: content } = e.target;
        state.mainForm.fields.url = content;
    });

    elements.mainForm.addEventListener('submit', (e) => {
        e.preventDefault();

        state.mainForm.error = null;
        state.subscribeProcess.error = null;
        state.subscribeProcess.status = 'sending';

        validator(state.mainForm.fields.url, state.rssList)
            .then((validatedUrl) => {
                state.subscribeProcess.status = 'sending';
                state.rssList.push(validatedUrl)
                return Promise.resolve();
            })
            .then(() => {
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
    })
}

export default app;