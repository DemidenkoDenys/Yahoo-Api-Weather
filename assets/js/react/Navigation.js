import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Filter from './Filter';

class Navigation extends React.Component {

    render(){
        let showAllMenu = ( this.props.store.cities.length > 0 )
          ? <li key='0'><NavLink to='/' isActive={ () => { return (this.props.location.pathname === '/') } }>Show all cities</NavLink></li>
          : null;

        let citiesMenu = this.props.store.cities.map((item) => {
            return <li key={+item.city.item.lat + +item.city.item.long}><NavLink to={'/'+item.city.location.city}>{ item.city.location.city }</NavLink></li>
        });

        return (
            <header className="header top-bar">
                <nav className="top-bar-left">
                    <ul className="menu">
                        { showAllMenu }
                        { citiesMenu }
                    </ul>
                </nav>
                <div className="top-bar-right">
                    <Filter />
                </div>
            </header>
        )
    }
}

export default withRouter(connect(
    store => ({
        store: store
    }), null)(Navigation));