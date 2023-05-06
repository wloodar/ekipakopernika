import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { createUrl } from '../../../functions/ImageUrl';
import axios from 'axios';
import moment from 'moment';
import s from './Explore.module.scss';
import Posts from './Posts/Posts';

import Logo from './logo.png';
import LogoWhite from './logo-biale.png';

class Explore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            feed: [],
            events: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/feed`).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: shuffle(res.data.categories).slice(0, 5) });
            }
        });

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/events/fetch/all`).then(res => {
            if (res.data.status === 1) {
                this.setState({ events: res.data.events });
            }
        });

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    }

    render() {
        const { events } = this.state;

        return (
            <div className={s.container}>
                <aside className={[s.menu, s.sticky].join(' ')}>
                    <div className={s.categories}>
                        <div className={s.container__mheader}>
                            <h5>Kategorie</h5>    
                        </div>

                        {this.state.categories.length === 0 ? [0,0,0,0,0].map((val, key) => (
                            <div className={s['categories-item']}>
                                <div className={s['categories-item__inner']}>
                                    <div className={s['categories-item__image']}>
                                        <SkeletonTheme color="#EDF0F3">
                                            <Skeleton/>
                                        </SkeletonTheme>
                                    </div>    
                                    <div className={s['categories-item__info']}>
                                        <h5><SkeletonTheme color="#EDF0F3"><Skeleton/></SkeletonTheme></h5>
                                        <p><SkeletonTheme color="#EDF0F3"><Skeleton/></SkeletonTheme></p>
                                    </div>
                                </div>    
                            </div>
                        )) : this.state.categories.map((obj, key) => <div className={s['categories-item']}>
                            <Link to={`/kategorie/${obj.seo_url}`}></Link>
                            <div className={s['categories-item__inner']}>
                                <div className={s['categories-item__image']}>
                                    <img src={createUrl(obj.cover_pic, "_small")}/>
                                </div>    
                                <div className={s['categories-item__info']}>
                                    <h5>{obj.name}</h5>
                                    <p>{obj.total_posts === undefined ? <Skeleton width={30}/> : obj.total_posts == 0 ? "0 postów" : obj.total_posts + " " + (obj.total_posts < 5 ? obj.total_posts == 1 ? "Post" : "Posty" : "Postów")}</p>
                                </div>
                            </div>     
                        </div>)}


                        <div className={s.categories__all}>
                            <Link to="/kategorie">Wszystkie kategorie</Link>
                        </div>
                    </div>
                </aside>
                <main className={s.feed} id="feed_explore">
                    <div className={s['feed-wrapper']}>
                        <div className={s['feed-wrapper__logo']}>
                            <h5>Witaj! <Link to="/onas">{"Poznaj nas >"}</Link></h5>
                            <img src={LogoWhite}/>
                        </div>
                        <Posts apiUrl="/posts/feed/fetch"/>
                    </div>
                </main>
                <div className={[s.sidebar, s.sticky].join(' ')}>
                    <div className={s.sidebar__inner}>
                        <div className={s.container__mheader}>
                            <h5>Wydarzenia</h5>    
                        </div>
                        <div className={s.events}>
                            {events.length > 0 ? <div>
                                <div className={s.events__item}>
                                    <div className={s.events__image}>
                                        <img src={createUrl(events[0].cover_pic, "_small")}/>
                                    </div>
                                    <div className={s.events__info}>
                                        <h4>{events[0].name}</h4>
                                        <p>{moment.unix(events[0].time).format("DD / MM / YYYY, HH:mm")}</p>
                                    </div>
                                </div>
                                
                                <div className={s.categories__all}>
                                    <Link to="/wydarzenia">Przejdź do wydarzeń {events.length > 1 ? <span className={s.events__count}>{events.length}</span> : null}</Link>
                                </div>
                            </div> : <div className={s.events__empty}>
                                <p>Brak wydarzeń</p>
                            </div> }
                        </div>
                        <div className={s.sidebar__footer}>
                            <ul>
                                <li>© 2021 EkipaKopernika</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Explore);