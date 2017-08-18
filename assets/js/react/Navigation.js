import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Filter from './Filter';

class Navigation extends React.Component {

    componentDidUpdate(){
        // console.log();
    }
    
    render(){

        let showAllItem = ( this.props.store.cities.length > 0 )
          ? <li key='0'>
                <NavLink to='/' isActive={ () => { return (this.props.location.pathname === '/') } }>
                    Show all cities
                </NavLink>
            </li> : null;

        let cities = this.props.store.cities.map((item, index) => {
            return <li key={index + 1}><NavLink to={'/'+item.city.location.city}>{ item.city.location.city }</NavLink></li>
        });


        return (
            <header className="header top-bar">
                <nav className="top-bar-left">
                    <ul className="menu">
                        { showAllItem }
                        { cities }
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