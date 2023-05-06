import React from 'react';
import Icon from '../../../Icons/Base';
import { NavLink, Link } from 'react-router-dom';
import s from './AppLayoutAside.module.scss';

function AppLayoutAside(props) {

    return (
        <aside className={s['aside-nav']}>
            <div className={s['aside-nav__section']}>
                <div className={s['aside-nav__item']}>
                    <NavLink exact to="/" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="home"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Strona główna</p>
                        </div>
                    </NavLink>
                </div>
                {/* <div className={s['aside-nav__item']}>
                    <NavLink exact to="/inbox" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="messagescircle"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Wiadomości</p>
                        </div>
                    </NavLink>
                </div> */}
            </div>

            {props.role === "superadmin" ?
            <div className={s['aside-nav__section']}>
                <div className={s['aside-nav__item']}>
                    <NavLink to="/admins" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="users"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Administratorzy</p>
                        </div>
                    </NavLink>
                </div>
                <div className={s['aside-nav__item']}>
                    <NavLink to="/events" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="calendar"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Wydarzenia</p>
                        </div>
                    </NavLink>
                </div>
                <div className={s['aside-nav__item']}>
                    <NavLink to="/categories" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="slack"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Kategorie</p>
                        </div>
                    </NavLink>
                </div>
                <div className={s['aside-nav__item']}>
                    <NavLink to="/about" activeClassName={s['aside-nav__item--active']}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="about"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Strona o nas</p>
                        </div>
                    </NavLink>
                </div>
            </div>: null}
            <div className={s['aside-nav__section']}>
                <div className={s['aside-nav__item']}>
                    <NavLink exact to="/publications" className={window.location.href.indexOf("publications") > -1 ? s['aside-nav__item--active'] : null}>
                        <div className={s['aside-nav__icon']}>
                            <Icon name="image"/>
                        </div>
                        <div className={s['aside-nav__name']}>
                            <p>Posty</p>
                        </div>
                    </NavLink>
                </div>
            </div>
        </aside>
    );
}

export default AppLayoutAside;