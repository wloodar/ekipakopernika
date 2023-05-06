import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import ReactLoading from 'react-loading';
import DateTimePicker from 'react-datetime-picker';
import s from './NewEvent.module.scss';
import ShowMessage from '../../../../Partials/FlashMessages';
import Icon from '../../../../Icons/Base';

class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            place: "",
            time: new Date(),
            image: "",
            waiting: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onChangePicker = this.onChangePicker.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();

        if (e.target.type === "file") {
            this.setState({ [e.target.name]: e.target.files[0] });
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
        
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
        this.setState({ time: date });
    }

    submitForm(e) {
        e.preventDefault();
        const formData = new FormData();
        const { name, place, description, time, image } = this.state;

        formData.append("ufiles", image);
        formData.append("name", name);
        formData.append("place", place);
        formData.append("description", description);
        formData.append("time", (time.getTime() / 1000).toFixed(0));

        this.setState({ waiting: true });
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/events/create`, formData, {headers: { 'Content-Type': 'multipart/form-data' }}).then(result => {
            this.setState({ waiting: false });
            console.log(result.data);
            if (result.data.status === 1) {
                this.setState({ name: "", place: "", description: "", image: "" });
                this.props.callbackFromParent(true);
                ShowMessage({text: "Pomyślnie utworzono nowe wydarzenie!", type: "success"});
            } else if (result.data.status === -1) {
                ShowMessage({text: result.data.general, type: "error"});
            } else {
                if (result.data.ufiles === undefined) { this.setState({ errors: result.data }); 
                } else {
                    this.setState({ errors: result.data, image: "" });
                }
            }
        });
    }

    render() {
        const { waiting, errors } = this.state;
        return (
            <div className={s.create}>
                <div className={s.create__form}>
                    <form onSubmit={this.submitForm} autoComplete="off" style={waiting ? { opacity: "0.4" } : { opacity: "1" }}>
                        <div className={cs(s.create__name, "card-form__row card-form__row--fwidth")}>
                            <label>Nazwa</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Wycieczka ..."
                                onChange={this.handleInputChange}
                                value={this.state.name}
                                autoComplete="off"
                            />
                            <p className={cs(s.counter, this.state.name.length > 128 ? s.counter__warning : null)}>{this.state.name.length } / 128 {this.state.name.length > 128 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.name !== '') ? <p className="card-form__error">{errors.name}</p> : ''}
                        </div>
                        <div className={cs(s.create__name, "card-form__row card-form__row--fwidth")}>
                            <label>Miejsce</label>
                            <input
                                type="text"
                                name="place"
                                placeholder="Liceum numer ..."
                                onChange={this.handleInputChange}
                                value={this.state.place}
                                autoComplete="off"
                            />
                            <p className={cs(s.counter, this.state.place.length > 128 ? s.counter__warning : null)}>{this.state.place.length } / 128 {this.state.name.place > 128 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.place !== '') ? <p className="card-form__error">{errors.place}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Opis</label>
                            <textarea autoComplete="off" onChange={this.handleInputChange} onInput={(e) => {e.target.style.height = "5px"; e.target.style.height = (e.target.scrollHeight)+"px"}} name="description" className="bs-textarea" style={{ minHeight: "200px" }}>{this.state.description}</textarea>
                            <p className={cs(s.counter, this.state.description.length > 2000 ? s.counter__warning : null)}>{this.state.description.length } / 2000 {this.state.description.length > 2000 ? " - Przekroczono limit" : null}</p>
                            {(errors !== undefined && errors.description !== '') ? <p className="card-form__error">{errors.description}</p> : ''}
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Data i czas</label>
                        </div>
                        <div className={s.picker}>
                            <DateTimePicker
                                onChange={this.onChangePicker}
                                value={this.state.time}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="card-form__row card-form__row--fwidth">
                            <label>Zdjęcie główne</label>
                        </div>
                        <div className={s.create__uploadimg}>
                            <label htmlFor="category_new_upload_img"><Icon name="image"/> <p>Wybierz zdjęcie</p></label>
                            <input type="file" name="image" onChange={this.handleInputChange} id="category_new_upload_img"/>
                            {(errors !== undefined && errors.ufiles !== '') ? <p className="card-form__error">{errors.ufiles}</p> : ''}
                            {this.state.image !== "" ? <span>Zdjęcie dodane</span> : null}
                        </div>
                        <div className={s.create__submit}>
                            <button type="submit" disabled={this.state.waiting} className="card-form__btn card-form__btn--submit">{waiting ? <ReactLoading type="bars" color="#ffffff" height="10px" width="20px" /> : "Utwórz"}</button>
                        </div>
                    </form>
                </div>
            </div>
        )   
    }
}

NewEvent.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(NewEvent));
