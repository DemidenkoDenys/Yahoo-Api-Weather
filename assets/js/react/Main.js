import React from 'react';
import { Switch, Route } from 'react-router';

import Cities from './Cities';
import City from './City';

class Main extends React.Component {

    render(){
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={ Cities }/>
                    <Route path='/:city' component={ City }/>
                </Switch>
            </main>
        )
    }
}

export default Main;