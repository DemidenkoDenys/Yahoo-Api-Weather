import { createStore } from 'redux';

import reducers from '../reducers/reducers';

let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => { 					// подписались на изменения хранилища
    // console.log(store.getState()); 			// при каждом изменении store будет выведего его
});

export default store;