import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import cs from 'classnames';
import Icon from '../../../Icons/Base';

import AllPosts from './AllPosts/AllPosts';
import PostRow from './PostRow/PostRow';

class Publications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            approve_new: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/user/new/approve-waiting`, { params: { page: 1, limit: 4 }}).then(result => {
            if (result.data.posts !== undefined && result.data.posts.length === 0) {
                // this.setState({ pagination: false });
            } else {
                this.setState({
                    approve_new: result.data.posts
                });
            }
        })
    }

    render() {
        const { role } = this.props.auth.user;

        console.log(this.state.approve_new);
        
        return (
            <div style={{minHeight: "120vh"}}>
                <header>
                    <div className="nbs-header">
                        <h3>Posty</h3>
                        <p>{role === "superadmin" ? "Tworzenie, edycja, zatwierdzanie i zarządzanie" : "Tworzenie nowych postów, proponowanie zmian w aktualnych"}</p>
                    </div>
                </header>
                <div className= "card card__apadding--common card__tmargin--common card__action--common">
                    <Link to="/publications/new"><Icon name="plus"/><p>Nowy post</p></Link>
                </div>
                {/* <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Oczekujące zmiany</h5>
                    </div>  
                </div> */}
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Czekające na potwierdzenie</h5>
                    </div>  
                    {this.state.approve_new.splice(0, 3).map((val, key) => (
                        <PostRow post={val} current_user={this.props.auth.user} key={key}/>
                    ))}
                    <div className="card__bottomaction">
                        <Link to="/publications/pending">Wszystkie oczekujące</Link>
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Wszystkie posty</h5>
                    </div>  
                    <AllPosts/>
                </div>
            </div> 
        )   
    }
}

Publications.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Publications));
