import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import IndexerApp from './components/App.js';

const store = configureStore();

render(
    <Provider store={store}>
      <IndexerApp />
    </Provider>,
    document.getElementById('root')
);
