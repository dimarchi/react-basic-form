import React, { Component } from 'react';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';

class Graph extends Component {

    render() {
        return (
            <Sparklines data={this.props.data}>
                <SparklinesLine color="blue" />
                <SparklinesReferenceLine type="min" />
            </Sparklines>
        )
    }
}

export default Graph;