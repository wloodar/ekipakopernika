import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from 'moment';
import 'moment/locale/pl';
import { createUrl } from '../../../functions/ImageUrl';
import s from './Events.module.scss';

import EventCover from './example.jpg';
import EventGraphic from './event.svg';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loading: true
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/events/fetch/all`).then(res => {
            if (res.data.status === 1) {
                this.setState({ loading: false, events: res.data.events });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        const { events, loading } = this.state;
        // FA383E
        return (
            <main className={s.main}>
                {loading ? <div>
                    <div className={s.banner}>
                        <div className={s.calendar}>
                            <div className={s.calendar__top}></div>
                            <div className={s.calendar__day}>
                                <p><SkeletonTheme color="#EDF0F3"><Skeleton /></SkeletonTheme></p>
                            </div>
                        </div>
                        <div className={s.cover}>
                            <SkeletonTheme color="#EDF0F3"><Skeleton height={300}/></SkeletonTheme>
                        </div>
                    </div>
                    <div className={s.time}>
                        <p><SkeletonTheme color="#EDF0F3"><Skeleton /></SkeletonTheme></p>
                    </div>
                    <div className={s.name}>
                        <h3><SkeletonTheme color="#EDF0F3"><Skeleton height={30}/></SkeletonTheme></h3>
                    </div>
                    <div className={s.place}>
                        <p><SkeletonTheme color="#EDF0F3"><Skeleton /></SkeletonTheme></p>
                    </div>
                    <div className={s.description}>
                        <p><SkeletonTheme color="#EDF0F3"><Skeleton height={200}/></SkeletonTheme></p>
                    </div>
                </div> : null}
                {!loading && events.length < 1 ? <div className={s.empty}>
                    <img src={EventGraphic}/>
                    <h5>Na ten moment nie odbywają się żadne wydarzenia...</h5>
                </div> : null}
                {!loading && events.length > 0 ? <div className={s.events}>
                    <div className={s.header}>
                        <h2>Zbliżające się wydarzenia</h2>
                    </div>
                    <ul>
                        {events.map((val, key) => <li key={key}>
                            <div className={s.banner}>
                                <div className={s.calendar}>
                                    <div className={s.calendar__top}></div>
                                    <div className={s.calendar__day}>
                                        <p>{moment.unix(val.time).format("DD")}</p>
                                    </div>
                                </div>
                                <div className={s.cover}>
                                    <img src={createUrl(val.cover_pic, "_medium")}/>
                                </div>
                            </div>
                            {val.old_time !== null ? <div className={s["time--new"]}>
                                <span>{moment.unix(val.old_time).locale('pl').format("DD MMMM YYYY o HH:mm")}</span>
                                <p>Nowy termin - {moment.unix(val.time).locale('pl').format("DD MMMM YYYY o HH:mm")}</p>
                            </div> : <div className={s["time--casual"]}>
                                <p>{moment.unix(val.time).locale('pl').format("DD MMMM YYYY o HH:mm")}</p>
                            </div> }
                            <div className={s.name}>
                                <h3>{val.name}</h3>
                            </div>
                            <div className={s.place}>
                                <p>{val.place}</p>
                            </div>
                            <div className={s.description}>
                                <p>{val.description}</p>
                            </div>
                        </li>)}
                    </ul>
                </div> : null}
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