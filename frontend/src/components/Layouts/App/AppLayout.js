import React, { Component, createRef } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cs from 'classnames';
import PropTypes from 'prop-types';
import s from './AppLayout.module.scss';
import $ from 'jquery';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './style.css';
import Logo from './logo.png';
import WlodevLogo from './wlodev.png';
 
class AppLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0, 
            height: 0,
            scrollingTimeout: 0
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.changeUnderlinePosition = this.changeUnderlinePosition.bind();
        this.responsiveMenuScrolled = this.responsiveMenuScrolled.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateUnderlinePosition();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate() {
        this.updateUnderlinePosition();
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    updateUnderlinePosition = (isAnimated) => {
        let menu = document.getElementById('mn_nav');
        if (menu) {
            let sliding_border = document.getElementById('nav_slide_click');
            
            if (isAnimated !== undefined && !isAnimated) {
                sliding_border.style.transition = "none";
            } else {
                sliding_border.style.transition = ".3s all ease";
            }

            const lengthOfItems = $('#mn_nav').children('li').length;
            
            const widthOfElement = Math.round(100 / lengthOfItems);
            
            const marginLeft = Math.round(widthOfElement * $('.mn_nav_active').parent().index());
            if ($('.mn_nav_active').parent().index() !== -1) {
                sliding_border.style.opacity = "1";
                sliding_border.style.marginLeft =  $('.mn_nav_active').parent().position().left + "px";
                sliding_border.style.width =  $('.mn_nav_active').parent().width() + "px";
            } else {
                sliding_border.style.opacity = "0";
            }
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
    }

    changeUnderlinePosition() {
        let menu = document.getElementById('mn_nav');

        if (menu) {
            let menu_slider_click = document.getElementById('nav_slide_click');
            menu_slider_click.style.transition = ".3s all ease";

            if ( menu_slider_click ) {
              nav_slider( menu, function( el, width, tempMarginLeft ) {   
                    el.onclick = () => {
                        menu_slider_click.style.width =  Math.round(width) + '%';                    
                        menu_slider_click.style.marginLeft = Math.round(tempMarginLeft) + '%';    
                    }
              });
            }
        }

        function nav_slider( menu, callback ) {
            
            let menu_width = menu.offsetWidth;

            menu = menu.getElementsByTagName( 'li' );            
            if ( menu.length > 0 ) {
              var marginLeft = [];

              [].forEach.call( menu, ( el, index ) => {

                var width = getPercentage( el.offsetWidth, menu_width );   
             
                var tempMarginLeft = 0;

                if ( index != 0 )  {
                  tempMarginLeft = getArraySum( marginLeft );
                }            

                callback( el, width, tempMarginLeft );      

                marginLeft.push( width );
              } );
            }
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
          
        function getArraySum( arr ) {
            let sum = 0;
            [].forEach.call( arr, ( el, index ) => {
              sum += el;
            } );
            return sum;
        }

    }

    responsiveMenuScrolled = (e) => {
        e.preventDefault();
        const self = this;        

        if (self.state.scrollingTimeout) {
            clearTimeout(self.state.scrollingTimeout);
        }
    }

    render() {

        return (
            <>
            <nav className={s.nav}>
                <div className={s['nav__inner']}>
                    <Link to="/"><img src={Logo} onLoad={() => this.updateUnderlinePosition(false)} /></Link>
                    {this.state.width > 900 ? <div className={s['nav-list']}>
                        <ul id="mn_nav">
                            <li><NavLink exact to="/" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Odkryj</NavLink></li>
                            <li><NavLink to="/kategorie" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Kategorie</NavLink></li>
                            <li><NavLink to="/wydarzenia" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Wydarzenia</NavLink></li>
                            <li><NavLink to="/onas" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>O nas</NavLink></li>
                            <hr id="nav_slide_click"/>
                        </ul>
                    </div> : null}
                    <div className={s['nav-share']}>
                        <Link to="/dodaj">
                            <p>Podziel się</p>
                        </Link>
                    </div>
                </div>
                <div className={s['nav-responsive']}>
                    <div className={s['nav-responsive__menu']}>
                        <div className={cs(s["nav-responsive__fade"], s["nav-responsive__fade--left"])}></div>
                        <div className={cs(s["nav-responsive__fade"], s["nav-responsive__fade--right"])}></div>
                        {this.state.width <= 900 ?
                            <ul id="mn_nav" onScroll={(e) => this.updateUnderlinePosition(false)}>
                                <Link to="/"><img src={Logo}/></Link>
                                <li><NavLink exact to="/" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Odkryj</NavLink></li>
                                <li><NavLink to="/kategorie" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Kategorie</NavLink></li>
                                <li><NavLink to="/wydarzenia" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Wydarzenia</NavLink></li>
                                <li><NavLink to="/onas" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>O nas</NavLink></li>
                                <li><NavLink to="/dodaj" activeClassName={[s['nav-list--active'], "mn_nav_active"].join(' ')}>Podziel się</NavLink></li>
                                <hr id="nav_slide_click"/>
                            </ul> : null}
                    </div>
                </div>
            </nav>
            <div className={s.wrap}>
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    className="example"
                >
                    {React.cloneElement(this.props.children)}
                </ReactCSSTransitionGroup>
            </div>
            <footer className={s.footer}>
                <div className={s['footer__inner']}>
                    <div className={s['footer__quotation']}>
                        <h5>#EkipaKopernika</h5>
                        <p>Dawna i nowoczesna kultura okiem #EkipyKopernika”</p>
                    </div>
                    <div className={s['footer__bottom']}>
                        <div className={s['footer__author']}>
                            <a href="https://wlodev.com/">
                                <p>established by</p>
                                <img src={WlodevLogo} alt="" />
                            </a>
                        </div>
                        <div className={s['footer__copyright']}>
                            <p>© 2021 EkipaKopernika</p>
                        </div>
                    </div>
                </div>
            </footer>
            </>
        )
    }
}

AppLayout.propTypes = {
    auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(AppLayout));