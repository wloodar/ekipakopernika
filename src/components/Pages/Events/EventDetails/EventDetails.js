import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class EventDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <>
                Szczegóły
            </>
        )
    }
}

export default withRouter(EventDetails);