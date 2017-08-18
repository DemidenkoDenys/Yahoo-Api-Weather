import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

// import windmill from "";

class City extends React.Component {

    componentDidUpdate(){
        console.log(this.props);
    }
    
    toCelsius(temperature){
        return Math.round((temperature - 32) / 1.8);
    }

    getCities(){
        return this.props.store.cities.map((item, index) => {

            const bladesStyle = {
                animationDuration: `${ 1 / item.city.wind.speed * 30 }s`
            };

            // if(item.location.city.toLowerCase().includes(this.props.text.toLowerCase())) //filtration

            return(
                <li key={ index } className={item.city.item.condition.text.replace(' ', '-')}>
                    <NavLink to={'/'+item.city.location.city}>

                        <div className="title">
                            <strong className="cityName">{ item.city.location.city }</strong>
                            <span className="countryName">({ item.city.location.country })</span>
                        </div>

                        <div className="temperatures">
                            <span className="tempLow">
                                <svg width="20" height="20" viewBox="0 0 48 48" data-icon="arrow-down"><path d="M34.7 29.5c.793-.773.81-2.038.04-2.83-.77-.79-2.037-.81-2.83-.038l-5.677 5.525V8.567h-4v23.59l-5.68-5.525c-.79-.77-2.058-.753-2.827.04-.378.388-.566.89-.566 1.394 0 .52.202 1.042.605 1.434l10.472 10.183L34.7 29.5z"></path></svg>
                                { this.toCelsius(item.city.item.forecast[0].low) }
                            </span>

                            <span className="tempHigh">
                                <svg width="20" height="20" viewBox="0 0 48 48" data-icon="arrow-up"><path d="M13.764 18.75c-.792.772-.808 2.037-.04 2.828.772.792 2.038.81 2.83.04l5.678-5.526v23.59h4v-23.59l5.68 5.525c.79.77 2.058.753 2.827-.04.377-.388.565-.89.565-1.394 0-.52-.202-1.042-.605-1.434L24.23 8.566 13.763 18.75z"></path></svg>
                                { this.toCelsius(item.city.item.forecast[0].high) }
                            </span>
                        </div>

                        <div className="wind">
                            <img className="blades" src="../dist/images/weather/windmill-blades.png" alt="" style={bladesStyle}/>
                            <img className="stand" src="../dist/images/weather/windmill-stand.png" alt="" />
                        </div>
                    </NavLink>

                </li>
            )
        })
    }

    render(){

        let component = null;

        if(this.props.store.cityListState === 'added' || this.props.store.cityListState === 'show'){
            component = (
                <div className="cities">
                    <ul>
                        { this.getCities() }
                    </ul>
                </div>
            );
        }

        if(this.props.store.cityListState === 'loading'){
            component = (
                <h1>Loading</h1>
            )
        }

        return component
    }
}

export default connect(
    store => ({
        store: store
    }), null)(City);

// {/*<div className="loading">*/}
// {/*<img src="../images/loading.gif" alt="loading"/>*/}
// {/*</div>*/}
