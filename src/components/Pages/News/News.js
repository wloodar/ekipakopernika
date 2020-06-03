import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class News extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <>
            <p>Aktualnosci</p>
            </>
        )
    }
}

export default withRouter(News);