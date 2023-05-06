import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import s from './Profile.module.scss';
import Icon from '../../../Icons/Base';
import ShowMessage from '../../../Partials/FlashMessages';

import { logoutUser } from '../../../../redux/actions/authentication';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            new_password: "",
            new_password_confirm: "",
            password_waiting: false,
            password_success: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    
    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        this.setState({ [e.target.name]: e.target.value });

        const errors = this.state.errors;   
        if (errors !== undefined) {
            this.setState(prevState => ({
                errors: {     
                    ...prevState.errors, 
                    [current_target]: '',
                    general: ""
                }
            }))
        }
    }

    submitForm(e) {
        e.preventDefault();
        const { old_password, new_password, new_password_confirm } = this.state;
        const passwordChange = {
            old_password: old_password,
            new_password: new_password,
            new_password_confirm: new_password_confirm 
        }

        this.setState({ password_waiting: true });
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/profile/change-password`, passwordChange).then(res => {
            if (res.data.status === undefined || res.data.status === 0) {            
                this.setState({ errors: res.data, password_waiting: false });
                ShowMessage({text: "Zmiana hasła nie przebiegła pomyślnie!", type: "error"});
            } else {
                ShowMessage({text: "Zmiana hasła przebiegła pomyślnie!", type: "success"});
                this.setState({ password_waiting: false, password_success: true, old_password: "", new_password: "", new_password_confirm: "" });
            }
        });
    }

    render() {
        const { errors } = this.state;
        const { first_name, last_name, email, role } = this.props.auth.user;
        return (
            <div className={s.wrap}>
                <header>
                    <div className="nbs-header">
                        <h3>Zarządzanie kontem</h3>
                        <p>Twoje dane, zmiana hasła i twoje dodatkowe preferencje</p>
                    </div>
                </header>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Twoje dane</h5>
                    </div>  
                    <div className={s["card-person"]}>
                        <div className={cs("user-icon", s["card-person__icon"], role === "superadmin" ? "bs-gradient--turquoise" : "bs-gradient--pink")}>
                            <span>{first_name.charAt(0)}</span>
                        </div>
                        <div className={s["card-person__name"]}>
                            <p>{first_name + " " + last_name}</p>
                            <span>{email}</span>
                        </div>
                        <div className="card__blockbtn card__blockbtn--text" style={{ textAlign: "right", width: "9rem" }}>
                            <button onClick={this.props.logoutUser}>Wyloguj się</button>
                        </div>
                    </div>
                </div>

                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--spadding">
                        <h5>Zmiana hasła</h5>
                    </div>  
                    <div className="card-form">
                        <form onSubmit={this.submitForm} autoComplete="none" style={this.state.password_waiting ? { opacity: 0.3 } : null}>
                            <div className="card-form__row card-form__row--fwidth">
                                <label>Stare hasło</label>
                                <input  
                                    type="password"
                                    name="old_password"
                                    autoComplete="off"
                                    placeholder="********"
                                    onChange={this.handleInputChange}
                                    value={this.state.old_password}
                                />
                                {(errors !== undefined && errors.old_password !== '') ? <p className="card-form__error">{errors.old_password}</p> : ''}
                            </div>
                            <div className="card-form__row card-form__row--fwidth">
                                <label>Nowe hasło</label>
                                <input  
                                    type="password"
                                    name="new_password"
                                    autoComplete="off"
                                    placeholder="********"
                                    onChange={this.handleInputChange}
                                    value={this.state.new_password}
                                />
                                {(errors !== undefined && errors.new_password !== '') ? <p className="card-form__error">{errors.new_password}</p> : ''}
                            </div>
                            <div className="card-form__row card-form__row--fwidth">
                                <label>Powtórz nowe hasło</label>
                                <input  
                                    type="password"
                                    name="new_password_confirm"
                                    autoComplete="off"
                                    placeholder="********"
                                    onChange={this.handleInputChange}
                                    value={this.state.new_password_confirm}
                                />
                                {(errors !== undefined && errors.new_password_confirm !== '') ? <p className="card-form__error">{errors.new_password_confirm}</p> : ''}
                            </div>
                            <div className="card-form__row">
                                <button disabled={this.state.password_waiting} className="card-form__btn card-form__btn--submit">Aktualizuj</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader">
                        <h5>Preferencje</h5>
                    </div>  
                    <div className={cs(s.card__row, s['card-preferences__darkmode'])}>
                        <Icon name="moon"/>
                        <p>Tryb Dark mode</p>
                        <span>Wkrótce!</span>
                    </div>
                </div>
            </div> 
        )   
    }
}

Profile.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired,
    logoutUser: PropTypes.func
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(Profile));
