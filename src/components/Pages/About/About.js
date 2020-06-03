import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import s from './About.module.scss';

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div className={s.wrap}>
                
            </div>
        )
    }
}

export default withRouter(About);