import 'jquery-popup-overlay';
import React from 'react';

import Navigation from './react/Navigation';
import Main from './react/Main';

class App extends React.Component {

    render(){
        return (
            <div>
                <Navigation />
                <Main />
            </div>
        )
    }
}

export default App;