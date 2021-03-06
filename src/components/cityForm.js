import React, { Component } from 'react';
import axios from 'axios';
import { API_KEY } from '../apikeys';
import { Line } from 'react-chartjs-2';

let temps = [];
let times = [];

class CityForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            city : '', 
            graph : [],
            finished : false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let str = event.target.value;
        this.setState({city : str});
    }

    handleSubmit(event) {
        if (this.state.city !== '' ) 
        {
            event.preventDefault();

            // emptying the data array, otherwise submitting would just add to it when repeatedly submitted
            temps = [];
            
            const ROOT_URL = 'http://api.openweathermap.org/data/2.5/forecast';

            /*
                cnt: how many data points, in this calse limited to nine (24 hours), default much higher
                units: temperature in celsius
            */

            const fetchAddress = `${ROOT_URL}?q=${this.state.city}&cnt=9&units=metric&APPID=${API_KEY}`;

            axios.get(fetchAddress)
            .then(response => {
                this.setState({
                    city : this.state.city,
                    graph : response.data.list
                })

                this.state.graph.map((measure => {
                    temps.push(measure.main.temp);
                    times.push(measure.dt_txt);
                    return measure;
                }))

                this.setState({
                    finished : true
                })
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    handleChart(chartData, chartDates) {
        return {
            labels : chartDates,
            datasets : [{
                tension : 0,
                data : [...chartData, 50, -50],
                label : this.state.city
            }]
        }
    }

    render() {
        if (!this.state.finished) 
        {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <strong>Please enter the location and country (two letter country code), separated by a comma:</strong><br />
                            <input type="text" value={this.state.city} onChange={this.handleChange} placeholder="Example: Oulu,fi" /><br />
                            <input type="submit" value="Search" />
                        </label>
                    </form>
                </div>
            )
        } 
        else {
            return (
                <div>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <strong>Please enter the location and country (two letter country code), separated by a comma:</strong><br />
                                <input type="text" value={this.state.city} onChange={this.handleChange} placeholder="Example: Oulu,fi" /><br />
                                <input type="submit" value="Search" />
                            </label>
                        </form>
                    </div>
                    <div>
                        <h1>Weather forecast for the next 24 hours, temperatures in Celsius</h1>
                        <Line data={this.handleChart(temps, times)} />
                    </div>
                </div>
            )
        }
    }
}

export default CityForm;