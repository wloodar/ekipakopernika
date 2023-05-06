import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { loginUser } from '../../../../redux/actions/authentication';
import ReactLoading from 'react-loading';
import $ from 'jquery';
import s from './Login.module.scss';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            waiting: false
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    
        if (nextProps.errors !== undefined) {
            this.setState({ errors: nextProps.errors, waiting: false });
        }
    }

    componentDidMount() {
                
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
            login: this.state.login,
            password: this.state.password
        }
        this.props.loginUser(user);
        this.setState({ waiting: true });
    }

    render() {
        const { errors, waiting } = this.state;

        return (
            <div className={s.main}>
                <div className={cs(s.box, "card")}>
                    {/* <div className={s.header}>
                        <h4>#EkipaKopernika Admin</h4>
                        <p>Logowanie</p>
                    </div> */}
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>#EkipaKopernika Admin</h5>
                    </div> 
                    <div className={s.form}>
                        <form onSubmit={this.submitForm} autoComplete="none">
                            <div className="card-form__row card-form__row--fwidth">
                                <input
                                    type="text"
                                    name="login"
                                    autoComplete="off"
                                    placeholder="Email"
                                    onChange={this.handleInputChange}
                                    value={this.state.email}
                                />
                                {(errors !== undefined && errors.login !== '') ? <p className="card-form__error">{errors.login}</p> : ''}
                            </div>
                            <div className="card-form__row card-form__row--fwidth">
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="off"
                                    placeholder="Hasło"
                                    onChange={this.handleInputChange}
                                    value={this.state.password}
                                />
                                {/* <img src=""/> */}
                                {(errors !== undefined && errors.password !== '') ? <p className="card-form__error">{errors.password}</p> : ''}
                                {(errors !== undefined && errors.general !== '') ? <p className="card-form__error">{errors.general}</p> : ''}
                            </div>
                            <div className="card-form__row">
                                <button type="submit" disabled={this.state.waiting} className="card-form__btn card-form__btn--submit card-form__btn--right">{waiting ? <ReactLoading type="bars" color="#ffffff" height="auto" width="auto" /> : "Zaloguj się"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> 
        )   
    }
}

Login.propTypes = {
    loginUser: PropTypes.func,
    errors: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default withRouter(connect(mapStateToProps, { loginUser })(Login));
