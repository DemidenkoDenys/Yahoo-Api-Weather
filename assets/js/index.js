import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import store from './react/store';
import App from './app';

const history = createBrowserHistory();
history.push('/');

render(
    <Provider store={ store }>
        <BrowserRouter history={history}>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-app')
);
