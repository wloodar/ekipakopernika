import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import update from 'immutability-helper';
import bs from '../AppPages.module.scss';
import s from './Categories.module.scss';
import Icon from '../../../Icons/Base';

import NewCategory from './NewCategory/NewCategory';
import ShowMessage from '../../../Partials/FlashMessages';

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            before_edit: '',
        };

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }

        this.fetchCategories = this.fetchCategories.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.nameFocusStart = this.nameFocusStart.bind(this);
        this.nameFocusEnd = this.nameFocusEnd.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.onNewCategory = this.onNewCategory.bind(this);
    }

    componentDidMount() {
        this.fetchCategories();
    }

    fetchCategories() {
        axios.get(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + "/categories/all").then(res => {      
            res.data.categories.forEach(el => {
                const path = 'category_' + el.uuid;
                this.setState({ [path]: el.name });
            });      
            this.setState({ categories: res.data.categories });
        });
    }

    statusChange(e, status, category_uuid) {   
        e.preventDefault();

        if (status === 1 || status === 0) {
            axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/categories/modify`, {modify_type: "status", status: status, category_uuid: category_uuid}).then(result => {
                if (result.data.status === 1) {
                    const index = this.state.categories.findIndex(c => c.uuid == category_uuid);
                    let categoriesCopy = [...this.state.categories];
                    categoriesCopy[index] = {...categoriesCopy[index], status: status}
                    this.setState({
                        categories: categoriesCopy
                    });

                    ShowMessage({text: "Pomyślnie zaktualizowano widoczność kategorii!", type: "success"});
                } else {
                    ShowMessage({text: result.data.general, type: "error"});
                }
            });
        } else {
            if (window.confirm("Czy jesteś pewny / a usunięcia kategorii?")) {
                axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/categories/modify`, {modify_type: "status", status: status, category_uuid: category_uuid}).then(result => {
                    if (result.data.status === 1) {
                        const index = this.state.categories.findIndex(c => c.uuid == category_uuid);
                        let categoriesCopy = [...this.state.categories];
                        categoriesCopy.splice(index, 1);
                        this.setState({
                            categories: categoriesCopy
                        });
    
                        ShowMessage({text: "Pomyślnie usunięto kategorie!", type: "success"});
                    } else {
                        ShowMessage({text: result.data.general, type: "error"});
                    }
                });
            }
        }
    }

    inputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    nameFocusStart(e) {        
        this.setState({ before_edit: e.target.value });
    }

    nameFocusEnd(e) {
        const currVal = e.target.value;
        const currName = e.target.name;
        const beforeName = this.state.before_edit;

        // this.state.categories.filter(c => c.uuid === 1)
        if (beforeName === currVal) {

        } else if (currVal.trim().length === 0) {
            this.setState({ [currName]: beforeName });
            ShowMessage({text: "Nazwa kategorii nie może być pusta.", type: "error"});
        } else if (currVal.length > 64) {
            this.setState({ [currName]: beforeName });
            ShowMessage({text: "Nazwa kategorii nie może być dłuższa niż 64 znaki.", type: "error"});
        } else if (this.state.categories.filter(c => c.name.toLowerCase() === currVal.toLowerCase()).length > 0) {
            this.setState({ [currName]: beforeName });
            ShowMessage({text: "Kategoria o takiej nazwie już istnieje.", type: "error"});
        } else if (beforeName !== currVal) {
            axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/categories/modify`, {modify_type: "name", name: currVal, category_uuid: currName.split('_')[1]}).then(result => {                
                if (result.data.status === 1) {
                    ShowMessage({text: "Pomyślnie zaktualizowano nazwę kategorii!", type: "success"});

                    const index = this.state.categories.findIndex(c => c.uuid == currName.split('_')[1]);
                    let categoriesCopy = [...this.state.categories];
                    categoriesCopy[index].name = currVal;
                    this.setState({
                        categories: categoriesCopy
                    });
                } else {
                    ShowMessage({text: result.data.general, type: "error"});
                }
            });
        }
    }

    onNewCategory = (dataFromChild) => {
        if (dataFromChild) {
            this.fetchCategories();
        }
    }

    render() {
        const { categories } = this.state;        
        return (
            <>
                <header>
                    <div className="nbs-header">
                        <h3>Kategorie</h3>
                        <p>Dodawaj, edytuj, ukrywaj lub usuwaj kategorie</p>
                    </div>
                </header>
                <div className={s.wrap}>
                    <div className={s.useractions}>
                        <div className={cs(s.new, "card")}>
                            <div className="card__bsheader card__bsheader--spadding">
                                <h5>Stwórz nową</h5>
                            </div>  
                            <NewCategory callbackFromParent={this.onNewCategory}/>
                        </div>
                    </div>
                    <div className={cs(s.categories, "card")}>
                        <div className="card__bsheader card__bsheader--lpadding">
                            <h5>Lista kategorii</h5>
                        </div>  
                        <ul>
                            {categories.map((val, key) => <li key={key} className={s.category}>
                                <div className={s.category__image}>
                                    <img src={`${process.env.REACT_APP_UPLOAD_DEST}/${val.cover_pic.substr(0,2)}/${val.cover_pic.split('.')[0]}/${val.cover_pic.split('.')[0]}_medium.${val.cover_pic.split('.')[1]}`} alt="Grafika kategorii"/>
                                </div>
                                <div className={s.category__name}>
                                    <input
                                        value={this.state['category_' + val.uuid]}
                                        name={"category_" + val.uuid}
                                        onFocus={ this.nameFocusStart } 
                                        onBlur={ this.nameFocusEnd } 
                                        onChange={this.inputChange}
                                    />
                                </div>
                                <div className={s.category__actions}>
                                    {val.status === 1 ? <button onClick={(e) => this.statusChange(e, 0, val.uuid)} className={s['category__actions--disable']}><Icon name="eye"/></button> : <button onClick={(e) => this.statusChange(e, 1, val.uuid)} className={s['category__actions--enable']}><Icon name="eyeoff"/></button> }
                                    <button onClick={(e) => this.statusChange(e, -1, val.uuid)} className={s['category__actions--disable']}><Icon name="trash"/></button>
                                </div>
                            </li>)}   
                        </ul>
                    </div>
                </div>
            </> 
        )   
    }
}

Categories.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Categories));
