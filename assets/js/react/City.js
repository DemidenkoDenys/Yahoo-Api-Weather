import React from 'react';
import { connect } from 'react-redux';

class Foo extends React.Component {

    componentDidUpdate(){
        // this.props.checkCity();
        // console.log('city did update', this.props.match.params.city);

    }

    componentDidMount(){
        this.props.showAll();
        // console.log('city did mount');
    }

    toCelsius(temperature){
        return Math.round((temperature - 32) / 1.8);
    }

    render(){

        return (
            <ul>
                {
                    this.props.store.cities.map((item, index) => {
                        if(item.city.location.city === this.props.match.params.city) {
                            return (
                                <li key={ index }>{ item.city.location.city }
                                    <table>
                                        <caption>Температура на 10 дней</caption>
                                        <tbody>
                                        {
                                            item.city.item.forecast.map((item, index) => {
                                                return (
                                                    <tr key={ index }>
                                                        <td>{ item.day }
                                                            <em> ({ item.date })</em>
                                                        </td>
                                                        <td>
                                                            <strong>{ this.toCelsius(item.low) }
                                                                - { this.toCelsius(item.high) } C</strong>
                                                            <span> ( { item.text } )</span>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </li>
                            )
                        }
                    })
                }
            </ul>
        )
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