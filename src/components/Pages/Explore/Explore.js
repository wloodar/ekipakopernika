import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { createUrl } from '../../../functions/ImageUrl';
import axios from 'axios';
import s from './Explore.module.scss';
import Posts from './Posts/Posts';

import Logo from './logo.png';
import LogoWhite from './logo-biale.png';

class Explore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            feed: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/feed`).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: shuffle(res.data.categories).slice(0, 5) });
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
                        {/* <div className={s['feed-wrapper__logo']}>
                            <h5>Witaj! <Link to="/onas">{"Poznaj nas >"}</Link></h5>
                            <img src={Logo}/>
                        </div> */}
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
                            <div className={s.events__empty}>
                                <p>Brak wydarzeń</p>
                            </div>
                        </div>
                        <div className={s.sidebar__footer}>
                            <ul>
                                <li>© 2020 EkipaKopernika</li>
                                <li>Wykonał: <a href="https://www.instagram.com/wloda_r/" target="_blank">@wloda_r</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Explore);