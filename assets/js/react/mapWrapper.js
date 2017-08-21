import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends React.Component {
    render() {
        const style = {
            width: '100%',
            height: '50%'
        }
        
        return (
            <Map google={this.props.google}
                 zoom={6}
                 style={style}
                 initialCenter={this.props.coords}
            >

                <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />

                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        <h1>Kharkiv</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyAG-Hd-w7Qu3TMH8ZlFG9XUEGN70gIrn2U"
})(MapContainer)