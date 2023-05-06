import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { createUrl } from '../../../../../functions/ImageUrl';
import DateTimePicker from 'react-datetime-picker';
import Icon from '../../../../Icons/Base';
import ShowMessage from '../../../../Partials/FlashMessages';
import cs from 'classnames';
import s from './ExactEvent.module.scss';

class ExactEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: {},
            loading: true,
            updating: false
        };

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onChangePicker = this.onChangePicker.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/events/fetch/${this.props.match.params.seourl}`).then(res => {     
            if (res.data.status === 1) {
                this.setState({ loading: false, event: res.data.event });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();

        const {name, value} = e.target;
        this.setState(prevState => ({
            event: {
                ...prevState.event,
                [name]: value
            }
        }))

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

    onChangePicker = date => {
        console.log(date);
        this.setState(prevState => ({
            event: {
                ...prevState.event,
                time: (date.getTime() / 1000).toFixed(0)
            }
        }))
    }

    submitUpdate() {
        const { name, place, description, time, shortid } = this.state.event;

        const eventEdit = {
            name: name,
            place: place,
            description: description,
            time: time,
            shortid: shortid
        }

        this.setState({ updating: true });
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/events/edit`, eventEdit).then(result => {
            this.setState({ updating: false });
            if (result.data.status === 1) {
                ShowMessage({text: "Edycja wydarzenia przebiegła pomyślnie!", type: "success"});
            } else if (result.data.status === -1) {
                ShowMessage({text: result.data.general, type: "error"});
            } else {
                this.setState({ errors: result.data });
            }
        });
    }

    deleteEvent = () => {
        if (window.confirm("Czy jesteś pewny / a usunięcia wydarzenia?")) {
            axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/events/delete`, { shortid: this.state.event.shortid }).then(result => {
                if (result.data.status === 1) {
                    ShowMessage({text: "Pomyślnie usunięto wydarzenie!", type: "success"});
                    this.props.history.push('/events');
                } else if (result.data.status === -1) {
                    ShowMessage({text: result.data.general, type: "error"});
                }
            });
        }
    }

    render() {
        const { loading, updating, event, errors } = this.state;

        return (
            <>
            <div className="b-back">
                <Link to="/events"><Icon name="arrowleft"/><p>Wszystkie wydarzenia</p></Link>
            </div>
            {loading ? <p>ładuje ...</p> : null}
            {!loading && Object.keys(event).length === 0 ? <p>Takie wydarzenie nie istnieje</p> : null}
            {!loading && Object.keys(event).length !== 0 ? <div className="card card__tmargin--common card__apadding--common">
                <div className={s.event}>
                    <div className={s.cover}>
                        <img src={createUrl(event.cover_pic, "_medium")}/>
                    </div>
                    <div className={s.details} style={updating ? { opacity: "0.3" } : { opacity: "1" }}>
                        <div className="card-form__row card-form__row--fwidth" style={{ marginTop: 0 }}>
                            <label>Nazwa</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Wycieczka ..."
                                onChange={this.handleInputChange}
                                value={event.name}
                                autoComplete="off"
                            />
                            <p className={cs(s.counter, event.name.length > 128 ? s.counter__warning : null)}>{event.name.length } / 128 {event.name.length > 128 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.name !== '') ? <p className="card-form__error">{errors.name}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Miejsce</label>
                            <input
                                type="text"
                                name="place"
                                placeholder="Liceum numer ..."
                                onChange={this.handleInputChange}
                                value={event.place}
                                autoComplete="off"
                            />
                            <p className={cs(s.counter, event.place.length > 128 ? s.counter__warning : null)}>{event.place.length } / 128 {event.name.place > 128 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.place !== '') ? <p className="card-form__error">{errors.place}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Opis</label>
                            <textarea autoComplete="off" onChange={this.handleInputChange} onInput={(e) => {e.target.style.height = "5px"; e.target.style.height = (e.target.scrollHeight)+"px"}} name="description" className="bs-textarea" style={{ minHeight: "320px" }}>{event.description}</textarea>
                            <p className={cs(s.counter, event.description.length > 2000 ? s.counter__warning : null)}>{event.description.length } / 2000 {event.description.length > 2000 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.description !== '') ? <p className="card-form__error">{errors.description}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Data i czas</label>
                        </div>
                        <div className={s.picker}>
                            <DateTimePicker
                                onChange={this.onChangePicker}
                                value={new Date(event.time*1000)}
                                minDate={new Date()}
                            />
                        </div>
                    </div>
                </div>
                <div className={s.actions}>
                    <button onClick={() => this.submitUpdate()} className="card-form__btn card-form__btn--submit" disabled={updating}>Zapisz zmiany</button>
                    <button onClick={() => this.deleteEvent()} className="card-form__btn card-form__btn--reject">Usuń wydarzenie</button>
                </div>
            </div> : null}
            </>
        )   
    }
}

ExactEvent.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(ExactEvent));
