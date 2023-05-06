import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import ReactLoading from 'react-loading';
import s from './NewPerson.module.scss';
import ShowMessage from '../../../../Partials/FlashMessages';
import Icon from '../../../../Icons/Base';

class NewCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            create_name: "",
            create_description: "",
            create_image: "",
            waiting: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
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

    submitForm(e) {
        e.preventDefault();
        const formData = new FormData();
        const { create_name, create_image, create_description } = this.state;

        formData.append("ufiles", create_image);
        formData.append("create_name", create_name);
        formData.append("create_description", create_description);

        this.setState({ waiting: true });
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/about/create`, formData, {headers: { 'Content-Type': 'multipart/form-data' }}).then(result => {
            this.setState({ waiting: false });
            if (result.data.status === 1) {
                this.setState({ create_name: "", create_description: "", create_image: "" });
                this.props.callbackFromParent(true);
                ShowMessage({text: "Pomyślnie dodano nową osobę!", type: "success"});
            } else if (result.data.status === -1) {
                ShowMessage({text: result.data.general, type: "error"});
            }
        });
    }

    render() {
        const { waiting, errors } = this.state;
        return (
            <div className={s.create}>
                <div className={s.create__form}>
                    <form onSubmit={this.submitForm} autoComplete="off" style={waiting ? { opacity: "0.4" } : { opacity: "1" }}>
                        <div className={cs(s.create__row, "card-form__row card-form__row--fwidth")}>
                            <label>Imię i nazwisko</label>
                            <input
                                type="text"
                                name="create_name"
                                placeholder="Np. Łukasz Kowalski"
                                onChange={this.handleInputChange}
                                value={this.state.create_name}
                                autoComplete="off"
                            />
                            {(errors !== undefined && errors.create_name !== '') ? <p className="card-form__error">{errors.create_name}</p> : ''}
                        </div>
                        <div className={cs(s.create__row, "card-form__row card-form__row--fwidth")}>
                            <label>Opis</label>
                            <textarea autoComplete="off" onChange={this.handleInputChange} name="create_description" className="bs-textarea">{this.state.create_description}</textarea>
                        </div>
                        <div className={s.create__uploadimg}>
                            <label htmlFor="category_new_upload_img"><Icon name="image"/> <p>Wybierz zdjęcie</p></label>
                            <input type="file" name="create_image" onChange={this.handleInputChange} id="category_new_upload_img"/>
                            {(errors !== undefined && errors.ufiles !== '') ? <p className="card-form__error">{errors.ufiles}</p> : ''}
                            {this.state.create_image !== "" ? <span>Zdjęcie dodane</span> : null}
                        </div>
                        <div className={s.create__submit}>
                            <button type="submit" disabled={this.state.waiting} className="card-form__btn card-form__btn--submit">{waiting ? <ReactLoading type="bars" color="#ffffff" height="10px" width="20px" /> : "Dodaj"}</button>
                        </div>
                    </form>
                </div>
            </div>
        )   
    }
}

NewCategory.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(NewCategory));
