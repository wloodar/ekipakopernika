import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import $ from 'jquery';
import moment from 'moment';
import AuthLogin from '../../Pages/Auth/Login/Login';
import { logoutUser } from '../../../redux/actions/authentication';
import Aside from './AppLayoutAside/AppLayoutAside';
import s from './AppLayout.module.scss';
import { socket, appStart } from '../../../socket';

class AppLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            nav_shadow: false,
        };

        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }

        this.onUnload = this.onUnload.bind(this);
    } 

    onUnload = e => {
        const currentDate = new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z','');
        const duration = Date.parse(currentDate) - Date.parse(appStart);
        if (this.props.auth.isAuthenticated) {
            socket.emit("ADMIN_LEAVE", { uuid: this.props.auth.user.uuid, duration: duration, start: appStart, finish: currentDate });
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        window.addEventListener("beforeunload", this.onUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("beforeunload", this.onUnload);
    }

    handleScroll = () => {
        if (window.pageYOffset > 10) {
            this.setState({ nav_shadow: true });
        } else {
            this.setState({ nav_shadow: false });
        }
    };

    render() {
        const { nav_shadow } = this.state;
        return (
            <div className={s.wrap}>
                {this.props.auth.isAuthenticated ? <> 
                <main className={s.main}>
                    <nav className={cs(s.tnav, "sticky", nav_shadow ? s["tnav--shadow"] : null)}>
                        <div className={s.tnav__inner}>
                            <div className={s.tnav__left}>
                                <div className={s.tnav__logo}>
                                    <h4 className="bs-logo"><Link to="">#EkipaKopernika Admin</Link></h4>
                                </div>
                                <div className={s.tnav__search}>
                                    <div className={s.tnav__infobar}>Możliwy tylko odczyt danych - dodawanie / usuwanie / edytowanie wyłączone</div>
                                </div>
                            </div>
                            <div className={s.tnav__right}>
                                <div className={cs(s.tnav__user, "user-icon",this.props.auth.user.role === "superadmin" ? 'bs-gradient--turquoise' : 'bs-gradient--pink')}>
                                    <Link to="/profile"><span>{this.props.auth.user.first_name.charAt(0)}</span></Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className={s.main__container}>
                        <div className={s.main__aside}>
                            <Aside role={this.props.auth.user.role}/>
                        </div>
                        <div className={s["main-content"]}>
                            <div className={s["main-content__wrapper"]}>
                                <div className={s["main-content__inner"]}>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main></> : <AuthLogin/>}
            </div>
        )   
    }
}

AppLayout.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired,
    logoutUser: PropTypes.func
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(AppLayout));
