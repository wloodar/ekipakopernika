import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Icon from '../../../../Icons/Base';
import ReactLoading from 'react-loading';
import ShowMessage from '../../../../Partials/FlashMessages';
import { registerUser } from '../../../../../redux/actions/authentication';
 
class AdminsCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: shortid.generate(),
            role: "admin",
            waiting: false
        };

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    UNSAFE_componentWillReceiveProps(newProps) { 
        if (Object.entries(newProps.errors).length !== 0) {
            this.setState({ errors: newProps.errors, waiting: false });
            ShowMessage({text: "Niepoprawna próba rejestracji konta", type: "error"});
        } else {
            ShowMessage({text: "Rejestracja przebiegła pomyślnie!", type: "success"});
            this.props.history.push('/admins');
        }
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
        const user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            role: this.state.role,
            password: this.state.password,
        }
        this.props.registerUser(user);
        this.setState({ waiting: true });
    }

    render() {
        const { errors, waiting, success } = this.state;
        return (
            <>
                <div className="b-back">
                    <Link to="/admins"><Icon name="arrowleft"/><p>Administratorzy</p></Link>
                </div>
                <div className="card__swidth">
                    <div className="card__bsheader card__bsheader--spadding">
                        <h5>Utwórz konto</h5>
                    </div>  
                    <form onSubmit={this.submitForm} autoComplete="none">
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Imię</label>
                            <input 
                                type="text"
                                name="first_name" 
                                autoComplete="off"
                                onChange={this.handleInputChange}
                                value={this.state.first_name}
                                placeholder="np. Jan"
                                className="bs-input"
                            />
                            {(errors !== undefined && errors.first_name !== '') ? <p className="card-form__error">{errors.first_name}</p> : ''}
                        </div>  
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Nazwisko</label>
                            <input 
                                type="text"
                                name="last_name" 
                                autoComplete="off"
                                onChange={this.handleInputChange}
                                value={this.state.last_name}
                                placeholder="np. Kowalski"
                                className="bs-input"
                            />
                            {(errors !== undefined && errors.last_name !== '') ? <p className="card-form__error">{errors.last_name}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Adres Email</label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="off"
                                onChange={this.handleInputChange}
                                value={this.state.email}
                                placeholder="np. jan.kowalski@gmail.com"
                                className='bs-input'
                            />
                            {(errors !== undefined && errors.email !== '') ? <p className="card-form__error">{errors.email}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Rola osoby</label>
                            <select name="role" onChange={this.handleInputChange} value={this.state.role}> 
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super - Admin</option>
                            </select>
                            {(errors !== undefined && errors.role !== '') ? <p className="card-form__error">{errors.role}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Hasło</label>
                            <input
                                type="text"
                                name="password"
                                autoComplete="off"
                                onChange={this.handleInputChange}
                                value={this.state.password}
                                placeholder="********"
                                className='bs-input'
                            />
                            {(errors !== undefined && errors.password !== '') ? <p className="card-form__error">{errors.password}</p> : ''}
                            {(errors !== undefined && errors.general !== '') ? <p className="card-form__error">{errors.general}</p> : ''}
                        </div>
                        <div className="card-form__row">
                            <button type="submit" disabled={this.state.waiting} className="card-form__btn card-form__btn--submit card-form__btn--right">{waiting ? <ReactLoading type="bars" color="#ffffff" height="10px" width="20px" /> : "Utwórz konto"}</button>
                        </div>
                    </form>
                </div>
                
            </> 
        )   
    }
}

AdminsCreate.propTypes = {
    auth: PropTypes.object,
    registerUser: PropTypes.func,
    errors: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default withRouter(connect(mapStateToProps, { registerUser })(AdminsCreate));
