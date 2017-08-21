import React from 'react';
import { connect } from 'react-redux';

class Filter extends React.Component {

    weather = null;

    constructor() {
        super();
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        this.setState({ value: e.target.value });
    }
    
    checkExistCity(cityName){
        return this.props.store.cities.some(item =>
            cityName === item.city.location.city
        );
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.startLoading();

        $.getJSON(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places%20where%20text%20IN%20(%22${this.state.value}%22)%20and%20placeTypeName.content%3D'Town')&format=json&callback=?`)
            .done((data) => {
                if(data.query.count === 0) {
                    $('#popup-nocity').popup('show');
                    setTimeout(() => { $('#popup-nocity').popup('hide'); }, 1000);
                    this.props.showAllCities();
                }
                else{
                    // this.weather = data.query.results.channel;
                    console.log(data);

                    if(data.query.count > 1){
                        for(let i = 0; i < data.query.count; i++){
                            if(!this.checkExistCity(data.query.results.channel[i].location.city))
                                this.props.addCity({ type: 'add_city', city: data.query.results.channel[i] });
                            else{
                                this.props.showAllCities();
                                $('#popup-exist').popup('show');
                                setTimeout(() => { $('#popup-exist').popup('hide'); }, 1000);
                            }
                        }
                    }
                    if(data.query.count === 1){
                        if(!this.checkExistCity(data.query.results.channel.location.city))
                            this.props.addCity({ type: 'add_city', city: data.query.results.channel });
                        else{
                            this.props.showAllCities();
                            $('#popup-exist').popup('show');
                            setTimeout(() => { $('#popup-exist').popup('hide'); }, 1000);
                        }
                    }
                }

                this.setState({ value: '' });
            });
    }

    render(){
        return (
            <form onSubmit={ this.handleSubmit }>
                <div className="menu">
                    <li>
                        <input type="search" placeholder="Enter city..." id="filter-text" value={ this.state.value } onChange={ this.handleChange } required/>

                    </li>
                    <li>
                        <input className="button" type="submit" value="Submit" />
                    </li>
                </div>
            </form>
        );
    }
}

export default connect(
    store => ({
        store: store
    }),
    dispatch => ({
        addCity: (city) => { dispatch({ type: "add_city", city: city }); },
        startLoading: () => { dispatch({ type: "loading", cityListState: 'loading' }); },
        showAllCities: () => { dispatch({ type: "show_all", cityListState: 'show' }); }
    })
)(Filter);

