import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import moment from 'moment';
import { createUrl } from '../../../../functions/ImageUrl';
import s from './Events.module.scss';
import NewEvent from './NewEvent/NewEvent';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: []
        };

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }

        this.fetchEvents = this.fetchEvents.bind(this);
        this.onNewEvent = this.onNewEvent.bind(this);
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents() {
        axios.get(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + "/events/fetch/all").then(res => {        
            this.setState({ events: res.data.events });
        });
    }

    onNewEvent = (dataFromChild) => {
        if (dataFromChild) {
            this.fetchEvents();
        }
    }

    render() {

        return (
            <>
                <header>
                    <div className="nbs-header">
                        <h3>Wydarzenia</h3>
                        <p>Twórz nowe wydarzenia, zarządzaj, publikuj aktualności</p>
                    </div>
                </header>
                <div className={s.wrap}>
                    <div className={s.useractions}>
                        <div className={cs(s.new, "card")}>
                            <div className="card__bsheader card__bsheader--spadding">
                                <h5>Nowe wydarzenie</h5>
                            </div>  
                            <NewEvent callbackFromParent={this.onNewEvent}/>
                        </div>
                    </div>
                    <div className={cs(s.categories, "card")}>
                        <div className="card__bsheader card__bsheader--lpadding">
                            <h5>Lista wydarzeń</h5>
                        </div>  
                        <ul>
                            {this.state.events.map((val, key) => <li key={key} className={s.event}><Link to={`/events/${val.seo_url}`} className={s.item}>
                                <div className={s.item__image}>
                                    <img src={createUrl(val.cover_pic, "_small")} alt="Grafika Wydarzenia"/>
                                </div>
                                <div className={s.item__info}>
                                    <div className={s.item__name}>
                                        <h3>{val.name}</h3>
                                    </div>
                                    <div className={s.item__time}>
                                        <p>{moment.unix(val.time).format("DD/MM/YYYY, HH:mm")}</p>
                                    </div>
                                </div>
                            </Link></li>)}   
                        </ul>
                    </div>
                </div>
            </> 
        )   
    }
}

Events.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Events));
