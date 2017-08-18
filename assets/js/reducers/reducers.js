const initialState = {
    cities: [],
    cityListState: 'show'
};

export default function reducers(state, action) {

    if(state === undefined)
        return initialState;

    if(action.type === 'add_city'){
        let newState = Object.assign({}, state);
        newState.cities.push(action.city);
        newState.cityListState = 'added';
        return newState;
    }

    if(action.type === 'loading'){
        let newState = Object.assign({}, state);
        newState.cityListState = 'loading';
        return newState;
    }

    if(action.type === 'show_all'){
        let newState = Object.assign({}, state);
        newState.cityListState = 'show';
        return newState;
    }

    if(action.type === 'check_city'){
        let newState = Object.assign({}, state);
        newState.cityListState = action.city;
        return newState;
    }
};