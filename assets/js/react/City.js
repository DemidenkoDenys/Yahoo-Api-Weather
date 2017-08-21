import React from 'react';
import { connect } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, data, XAxis, YAxis, CartesianGrid, Tooltip, text, label } from 'recharts';


const CustomLabel = ({x, y, stroke, value}) => {
    return <text x={x} y={y} dy={-10} fill={stroke} fontSize={14} textAnchor="middle">{value} C&deg;</text>
};

const CustomXAxisTick = ({x, y, payload}) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
        </g>
    );
};

const CustomYAxisTick = ({x, y, payload}) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dx={-10} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value} C&deg;</text>
        </g>
    );
};

class City extends React.Component {

    data = [];

    toCelsius(temperature){
        return Math.round((temperature - 32) / 1.8);
    }

    setCityForecast(){
        this.data = [];
        this.props.store.cities.map((item) => {
            if(item.city.location.city === this.props.match.params.city) {
                item.city.item.forecast.map((item) => {
                    this.data.push({ name: item.day,
                                     min: this.toCelsius(item.low),
                                     max: this.toCelsius(item.high),
                                     amt: (this.toCelsius(item.low) + this.toCelsius(item.high)) / 2 });
                });
            }
        });
    }

    render(){
        this.setCityForecast();

        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={ this.data }
                           margin={{ top: 100, right: 100, left: 50, bottom: 0 }}>

                    <XAxis dataKey="name"
                           height={60}
                           padding={{left: 50, right: 50}}
                           tick={<CustomXAxisTick/>} />

                    <YAxis tick={<CustomYAxisTick/>} />

                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                    <Tooltip />

                    <Line type="monotone"
                          dataKey="min"
                          stroke="#00a0da"
                          activeDot={{r: 5, strokeWidth: 2, stroke: '#00a0da', fill: 'white'}}
                          label={<CustomLabel stroke="#00a0da"/>} />

                    <Line type="monotone"
                          dataKey="max"
                          stroke="#f78b1e"
                          activeDot={{r: 5, strokeWidth: 2, stroke: '#f78b1e', fill: 'white'}}
                          label={<CustomLabel stroke="#f78b1e"/>} />

                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default connect(
    store => ({
        store: store
    }), dispatch => ({
        checkCity: (city) => { dispatch({ type: "check_city", city: city }); },
        showAll: () => { dispatch({ type: "show_all" }); }
    })
)(City);