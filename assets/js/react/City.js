import React from 'react';
import { connect } from 'react-redux';
import { LineChart, Line, data, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

class Foo extends React.Component {

    data = [];
    activeCity = '';

    componentDidUpdate(){
        // console.log('city did update', this.props.match.params.city);
    }

    createChart(){

        this.getActiveCity();

        return (
            <LineChart width={ $(window).width() }
                       height={ 400 }
                       data={ this.data }
                       margin={{ top: 100, right: 50, left: 50, bottom: 0 }}>

                <XAxis dataKey="name" />
                <YAxis />

                <CartesianGrid strokeDasharray="5 5" />

                <Tooltip />

                <Line type="monotone" dataKey="min" stroke="#00a0da" activeDot={{r: 5, strokeWidth: 2, stroke: '#00a0da', fill: 'white'}} />
                <Line type="monotone" dataKey="max" stroke="#f78b1e" activeDot={{r: 5, strokeWidth: 2, stroke: '#f78b1e', fill: 'white'}} />

            </LineChart>
        );
    }

    componentDidMount(){
        this.props.showAll();
        // console.log('city did mount');
        this.createChart();
    }


    toCelsius(temperature){
        return Math.round((temperature - 32) / 1.8);
    }

    getActiveCity(){
        this.data = [];

        this.props.store.cities.map((item) => {
            if (item.city.location.city === this.props.match.params.city) {
                this.activeCity = item.city;
                this.activeCity.item.forecast.map((item) => {
                    this.data.push({ name: item.day, min: this.toCelsius(item.low), max: this.toCelsius(item.high), amt: (this.toCelsius(item.low) + this.toCelsius(item.high)) / 2 });
                });
            }
        });
    }

    render(){
        return this.createChart();
    }
}

export default connect(
    store => ({
        store: store
    }), dispatch => ({
        checkCity: (city) => { dispatch({ type: "check_city", city: city }); },
        showAll: () => { dispatch({ type: "show_all" }); }
    })
)(Foo);