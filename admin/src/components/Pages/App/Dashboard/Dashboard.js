import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import s from './Dashboard.module.scss';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    render() {
        const { first_name, last_name, role } = this.props.auth.user;

        return (
            <div>
                <header>
                    <div className={cs(s["header-icon"], role === "superadmin" ? s["header-icon--superadmin"] : s["header-icon--admin"])}>
                        <span>{first_name.charAt(0)}</span>
                    </div>
                    <div className="nbs-header nbs-header--paddingbg">
                        <h3>Cześć, {first_name + " " + last_name}</h3>
                        <p>Witaj w panelu administratora! Z tego miejsca możesz zarządzać różnymi elementami na stronie #EkipyKopernika.</p>
                    </div>
                </header>
            </div> 
        )   
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Dashboard));
