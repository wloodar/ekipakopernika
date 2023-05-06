import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import cs from 'classnames';
import bs from '../AppPages.module.scss';
import s from './About.module.scss';
import Icon from '../../../Icons/Base';
import { removeDiacritics } from '../../../../functions/RemoveDialect';
import { createUrl } from '../../../../functions/ImageUrl';
import ShowMessage from '../../../Partials/FlashMessages';

import NewPerson from './NewPerson/NewPerson';

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            people: [],
            displayed_people: [],
            search_people: '',
        };

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }

        this.searchUsers = this.searchUsers.bind(this);
        this.fetchPeople = this.fetchPeople.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
        this.onNewCategory = this.onNewCategory.bind(this);
    }

    componentDidMount() {
        this.fetchPeople();
    }

    fetchPeople() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/app/about/all`).then(result => {
            console.log(result.data);
            
            if (result.data.status === 1) {
                this.setState({ people: result.data.people, displayed_people: result.data.people });   
            }
        })
    }

    searchUsers(event) {
        let searcjQery = removeDiacritics(event.target.value.toLowerCase()),
        displayedContacts = this.state.people.filter((el) => {
            let name = removeDiacritics(el.name.toLowerCase());
            return name.indexOf(searcjQery) !== -1;
        })
        this.setState({
            [event.target.name]: event.target.value,
            displayed_people: displayedContacts
        })
    }

    onNewCategory = (dataFromChild) => {
        if (dataFromChild) {
            this.fetchPeople();
        }
    }

    deletePerson = (e, data) => {
        if (window.confirm("Czy jesteś pewny / a usunięcia osoby?")) {
            axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/about/delete`, {id: data.id, image: data.image}).then(result => {
                if (result.data.status === 1) {
                    const index = this.state.people.findIndex(c => c.id == data.id);
                    let peopleCopy = [...this.state.people];
                    peopleCopy.splice(index, 1);
                    this.setState({
                        people: peopleCopy,
                        displayed_people: peopleCopy,
                        search_people: ""
                    });

                    ShowMessage({text: "Pomyślnie usunięto osobę!", type: "success"});
                } else {
                    ShowMessage({text: result.data.general, type: "error"});
                }
            });
        }
    }

    render() {

        return (
            <>
                <header>
                    <div className="nbs-header">
                        <h3>O nas</h3>
                        <p>Zarządzanie stroną "o nas" - Dodawanie osób / usuwanie</p>
                    </div>
                </header>
                <div className={s.wrap}>
                    <div className={s.useractions}>
                        <div className={cs(s.new, "card")}>
                            <div className="card__bsheader card__bsheader--spadding">
                                <h5>Dodaj nową</h5>
                            </div>  
                            <NewPerson callbackFromParent={this.onNewCategory}/>
                        </div>
                    </div>
                    <div className={cs(s.people, "card")}>
                        <div className="card__bsheader card__bsheader--spadding">
                            <h5>Lista osób</h5>
                        </div>  
                        <div className="card-form__search card-form__search--fwidth">
                            <input
                                type="text"
                                name="search_people"
                                placeholder="Szukaj osoby"
                                onChange={this.searchUsers}
                                value={this.state.search_people}
                            />
                        </div>
                        <ul>
                            {this.state.displayed_people.map((val, key) => <li key={key} className={s.person}>
                                <div className={s.person__image}>
                                    <img src={createUrl(val.image, "_small")} alt="Grafika kategorii"/>
                                </div>
                                <div className={s.person__name}>
                                    <p>{val.name}</p>
                                </div>
                                <div className={s.person__actions}>
                                    <button onClick={(e) => this.deletePerson(e, {id: val.id, image: val.image})} className={s['person__actions--disable']}><Icon name="trash"/></button>
                                </div>
                            </li>)}   
                        </ul>
                    </div>
                </div>
            </> 
        )   
    }
}

About.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(About));
