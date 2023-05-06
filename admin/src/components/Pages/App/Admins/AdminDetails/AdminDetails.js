import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import uuidBase62 from 'uuid-base62';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pl';
import Icon from '../../../../Icons/Base';
import ShowMessage from '../../../../Partials/FlashMessages';
import s from './AdminDetails.module.scss';
import '../../../../../sass/components/_colors.scss';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: {}
        };
        
        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        } else {
            this.fetchUserDetails();
        }    

        this.fetchUserDetails = this.fetchUserDetails.bind(this);
        this.blockUser = this.blockUser.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    fetchUserDetails = () => {
        axios.get(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + "/users/details/" + uuidBase62.decode(this.props.match.params.id)).then(res => {
            if (res.data.status !== undefined && res.data.status === 0) {
                this.setState({ loading: false });    
            } else {
                this.setState({ loading: false, user: res.data });
            }
        });   
    }

    blockUser = (status) => {
        axios.post(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + `/users/block/${this.state.user.uuid}/${status}`).then(res => {
            if (res.data.status === 1) {
                this.fetchUserDetails();
                ShowMessage({text: status === 1 ? "Pomyślnie zablokowano konto" : "Pomyślnie odblokowano konto", type: "success"});
            } else {
                ShowMessage({text: status === 1 ? "Wystąpił nieoczekiwany błąd podczas blokowania konta" : "Wystąpił nieoczekiwany błąd podczas odblokowywania konta", type: "error"});
            }
        });  
    }

    deleteAccount = () => {
        if (window.confirm("Czy jesteś pewny / a usunięcia konta?")) {
            axios.post(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + `/users/delete/${this.state.user.uuid}`).then(res => {
                if (res.data.status === 1) {
                    ShowMessage({text: "Pomyślnie usunięto konto", type: "success"});
                    this.props.history.push('/admins');
                } else {
                    ShowMessage({text: "Wystąpił nieoczekiwany błąd podczas usuwania konta", type: "error"});
                }
            });  
        }
    }
    
    render() {
        const { user, loading } = this.state;

        return (
            <div>
                <div className="b-back">
                    <Link to="/admins"><Icon name="arrowleft"/><p>Administratorzy</p></Link>
                </div>
                <div className="card-row card-row__equal">
                    <div className="card card__apadding--common">
                        {user !== {} && loading === false ? <>
                        <div className="card__bsheader card__bsheader--lpadding">
                            <h5>Podstawowe dane</h5>
                        </div>  
                        <div className={s.name}>
                            <div className={cs(s.name__icon, "user-icon", user.role === "superadmin" ? 'bs-gradient--turquoise' : 'bs-gradient--pink')}>
                                <span>{user.first_name.charAt(0)}</span>
                            </div>
                            <div className={s.name__info}>
                                <h5>{user.first_name + " " + user.last_name}</h5>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        </> : null}
                    </div>
                    <div className="card card__apadding--common">
                        <div className="card__bsheader card__bsheader--lpadding">
                            <h5>Dostęp</h5>
                        </div>  
                        <button onClick={() => this.blockUser(user.blocked ? 0 : 1 )} className={cs("card-form__btn card-form__btn--fwidth", user.blocked ? "card-form__btn--submit" : "card-form__btn--reject")} style={{ marginTop: 0 }}>{user.blocked ? "Odblokuj konto" : "Zablokuj konto"}</button>
                    </div>
                </div>
                <div className="card card__apadding--common card__tmargin--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Ostatnie 5 sesji</h5>
                    </div>  
                    {user.sessions !== null ? <div className={s["sessions-list"]}>
                        <ul>
                            {user.sessions !== undefined ? user.sessions.map((val, key) => (
                                <li key={key}>
                                    <p><span>Od: </span>{moment(val.from).locale("pl").format("DD dddd / MM / YYYY HH:mm:ss")}<span>Do: </span>{moment(val.to).locale("pl").format("DD dddd / MM / YYYY HH:mm:ss")}<span>-</span> {moment.utc(moment(val.to).diff(val.from)).format("HH:mm:ss")}</p>
                                </li>
                            )) : null}
                        </ul>
                    </div> : <div className={s["sessions-empty"]}>
                        <p>Brak daych</p>
                    </div>}
                </div>
                <div className={s["delete-account"]}>
                    <button onClick={() => this.deleteAccount()}>Usuń konto</button>
                </div>
            </div> 
        )   
    }
}

Events.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(Events));
