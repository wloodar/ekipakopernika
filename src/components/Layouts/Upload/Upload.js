import React, { Component, createRef } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import s from './UploadLayout.module.scss';
import $ from 'jquery';
import Icon from '../../Icons/base';
 
class UploadLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {

        return (
            <div className={s.wrap}>
                <nav className={s.nav}>
                    <div className={s.nav__logo}>
                        <h3><Link to="/">#DrużynaKopernika</Link></h3>
                    </div>
                    <div className={s.nav__back}>
                        <Link to="/">Wróć do strony</Link>
                    </div>
                </nav>
                <div className="">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

UploadLayout.propTypes = {

};

const mapStateToProps = (state) => ({

});

export default withRouter(connect(mapStateToProps)(UploadLayout));