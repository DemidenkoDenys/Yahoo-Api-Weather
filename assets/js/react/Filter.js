import React from 'react';
import { connect } from 'react-redux';
import AgAutocomplete from 'react-algoliasearch';

class Filter extends React.Component {

    constructor() {
        super();
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // var client = algoliasearch('YourApplicationID', 'YourPublicAPIKey');

        // var index = client.initIndex('indexName');

        // index.search('something', function(err, content) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //
        //     console.log(content);
        // });
    }

    handleChange(e){
        this.setState({ value: e.target.value });
    }
    
    handleSubmit(e){
        e.preventDefault();
        this.props.startLoading();

        $.getJSON(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places%20where%20text%20IN%20(%22${this.state.value}%22)%20and%20placeTypeName.content%3D'Town')&format=json&callback=?`)
            .done((data) => {
                console.log(data);
                if(data.query.count === 0) {
                    $('#popup-nocity').popup('show');
                    setTimeout(() => { $('#popup-nocity').popup('hide'); }, 1000);
                    this.props.showAllCities();
                }
                else{
                    if(data.query.count > 1){
                        for(let i = 0; i < data.query.count; i++){
                            this.addCityToStore(data.query.results.channel[i]);
                        }
                    }
                    if(data.query.count === 1)
                        this.addCityToStore(data.query.results.channel);
                }
                this.setState({ value: '' });
            });
    }

    addCityToStore(city){
        if(!this.checkExistCity(city.location.city))
            this.props.addCity({ type: 'add_city', city: city });
        else{
            this.props.showAllCities();
            $('#popup-exist').popup('show');
            setTimeout(() => { $('#popup-exist').popup('hide'); }, 1000);
        }
    }

    checkExistCity(cityName){
        return this.props.store.cities.some(item =>
            cityName === item.city.location.city
        );
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



    /*
    * <AgAutocomplete
     apiKey={"6be0576ff61c053d5f9a3225e2a90f76"}
     appId={"latency"}
     displayKey="name"
     indices={[{index: 'contacts'}]}
     inputId="filter-text"
     placeholder="Search..."
     />
    *
    * */