import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import { createUrl } from '../../../functions/ImageUrl';
import s from './Upload.module.scss';
import Icon from '../../Icons/base';

import Article from './Article/Article';
import Post from './Post/Post';
import UploadView from './UploadView/UploadView';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pub_type: 2,
            first_name: '',
            last_name: '',
            class: '',
            categories: []
        };

        this.chooseCategory = this.chooseCategory.bind(this);
        this.choosePublicationType = this.choosePublicationType.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);        
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: res.data.categories });
            }
        });
    }

    componentWillUnmount() {

    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        this.setState({ [e.target.name]: e.target.value });
    }

    chooseCategory(categoryId) {     
        const categoryIndex = this.state.categories.findIndex(c => c.id === categoryId);
        const categoriesCopy = [...this.state.categories];       
        for (let i = 0; i < categoriesCopy.length; i++) {
            categoriesCopy[i].choosed = false;
        }
        categoriesCopy[categoryIndex].choosed = true;
        this.setState({ categories: categoriesCopy });
    }

    choosePublicationType(type) {
        if (type === 1 || type === 2) {
            this.setState({ pub_type: type });
        }
    }

    render() {
        const { pub_type, categories } = this.state;

        return (
            <div className={s.wrap}>
                <main className={s.main}>
                    <div className={s.main__toph}>
                        <h2>Podziel się </h2>
                    </div>

                    <div className={s.main__header}>
                        <h4>Dane osobowe</h4>
                    </div>
                    {!this.props.auth.isAuthenticated ? <div className={s.person}>
                        <div className={s.person__form}>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Imię ..."
                                value={this.state.first_name}
                                onChange={this.handleInputChange}   
                                autoComplete="off" 
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Nazwisko ..."
                                value={this.state.last_name}
                                onChange={this.handleInputChange}    
                                autoComplete="off" 
                            />
                            <input
                                type="text"
                                name="class"
                                placeholder="Klasa ..."
                                value={this.state.class}
                                onChange={this.handleInputChange}    
                                autoComplete="off" 
                            />
                        </div>
                    </div> : <div className={s.admin}>
                        <div className={s.admin__user}>
                            <div className={cs(this.props.auth.user.role === "superadmin" ? "bs-gradient--turquoise" : "bs-gradient--pink", s.admin__icon)}>
                                <span>{this.props.auth.user.first_name.charAt(0)}</span>
                            </div>
                            <div className={s.admin__name}>
                                <p>{this.props.auth.user.first_name + " " + this.props.auth.user.last_name}</p>
                                <span>{this.props.auth.user.email}</span>
                            </div>
                        </div>   
                        <div className={s.admin__panel}>
                            <a href="/admin34528" className={this.props.auth.user.role === "superadmin" ? "bs-gradient--turquoise" : "bs-gradient--pink"}>Panel Admina</a>
                        </div>
                    </div>}

                    <div className={s.categories}>
                        <div className={s.main__header}>
                            <h4>Wybierz kategorie</h4>
                        </div>
                        <div className={s.categories__grid}>
                            {categories.map((obj, key) => <div className={cs(s.categories__item, obj.choosed !== undefined && obj.choosed ? s["categories__item--active"] : null)} onClick={this.chooseCategory.bind(this, obj.id)} key={obj.id}>
                                <img src={createUrl(obj.cover_pic, "_small")}/>
                                <div className={s['categories__item--name']}>
                                    <p>{obj.name}</p>
                                    <span>wybrana</span>
                                </div>
                            </div>)}
                        </div>
                    </div>

                    {/* <div className={s.type}>
                        <div className={s.main__header}>
                            <h4>Wybierz typ publikacji</h4>
                        </div>
                        <div className={s.type__content}>
                            <div className={[s.type__item, pub_type == 2 ? s['type__item--active']:null].join(' ')} onClick={() => this.choosePublicationType(2)}>
                                <Icon name="image"/>
                                <p>Krótki post</p>
                            </div>
                            <div className={[s.type__item, pub_type == 1 ? s['type__item--active']:null].join(' ')} onClick={() => this.choosePublicationType(1)}>
                                <Icon name="article"/>
                                <p>Artykuł</p>
                            </div>
                        </div>
                    </div> */}

                    <div className={s.content}>
                        <div className={s.content__left}>
                            {/* {pub_type === 1 ? <Article user_data={{pub_type: this.state.pub_type, first_name: this.state.first_name, last_name: this.state.last_name, class: this.state.class}}/> : null} */}
                            <div className={cs(s.attachments, s.content__box)}>
                                <div className={s.main__header}>
                                    <h4>Treść</h4>
                                </div>
                                <div className={s.attachments__content}>
                                    {pub_type === 2 ? <Post user_data={{pub_type: this.state.pub_type, first_name: this.state.first_name, last_name: this.state.last_name, class: this.state.class}}/> : null}
                                </div>
                            </div> 
                        </div>
                        <div className={s.content__right}>
                            <div className={s.attachments}>
                                <div className={s.main__header}>
                                    <h4>Załączniki</h4>
                                </div>
                                <div className={s.attachments__content}>
                                    <UploadView header={<div className={s.main__header}><h4>Dodane pliki</h4></div>} />
                                </div>
                            </div> 
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

Upload.propTypes = {
    auth: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Upload));