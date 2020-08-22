import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import s from './Events.module.scss';

import EventCover from './example.jpg';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/events/fetch/all`).then(res => {
            if (res.data.status === 1) {
                this.setState({ events: res.data.events });
            }
        });
    }

    render() {
        return (
            <main className={s.main}>
                
            </main>
        )
    }
}

Events.propTypes = {
    auth: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Events));