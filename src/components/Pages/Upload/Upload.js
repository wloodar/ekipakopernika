import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import $ from 'jquery';
import { createUrl } from '../../../functions/ImageUrl';
import s from './Upload.module.scss';
import Icon from '../../Icons/base';

import cheer1 from './Illustrations/cheer1.svg';
import cheer2 from './Illustrations/cheer2.svg';
import cheer3 from './Illustrations/cheer3.svg';

import Post from './Post/Post';
import UploadView from './UploadView/UploadView';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pub_type: 2,
            first_name: '',
            last_name: '',
            user_class: '',
            categories: [],
            post_content: "",
            files: [],
            errors: {},
            success: false,
            success_graphic_number: Math.floor(Math.random() * (4 - 1)) + 1
        };

        this.chooseCategory = this.chooseCategory.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);       
        this.callbackFunction = this.callbackFunction.bind(this); 
        this.callbackFiles = this.callbackFiles.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.submitPost = this.submitPost.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: res.data.categories });
            }
        });
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

    callbackFunction = (childData) => {
        this.setState({post_content: childData});
    }

    callbackFiles = (files) => {        
        const oldFiles = this.state.files;
        oldFiles.push(files);
        this.setState({ files: oldFiles });
    }

    removeFile = (file) => {
        const { files } = this.state;
        const index = files.findIndex(fl => fl.path === file.path);
        let filesCopy = [...this.state.files];
        filesCopy.splice(index, 1);
        this.setState({ files: filesCopy });   
    }

    validateForm(choosed_category) {
        const { first_name, last_name, user_class, post_content } = this.state; 
        let errors = {};
        
        // if (!first_name.trim().length > 0) {
        //     console.log('eeeee');
        // }

    }

    submitPost = async (e) => {
        e.preventDefault(); 
        const formData = new FormData();
        const { first_name, last_name, user_class, categories, post_content, files } = this.state; 
        const choosedCategory = await categories.filter(category => category.choosed);        

        if (choosedCategory.length > 0) {
            for(var x = 0; x<files.length; x++) {
                formData.append('ufiles', files[x])
            }
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("user_class", user_class);
            formData.append("category_id", choosedCategory[0].id);
            formData.append("post_content", post_content);
            
            axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/posts/create`, formData, {headers: { 'Content-Type': 'multipart/form-data' }}).then(result => {
                console.log(result);
                
                this.setState({ success: true });
                $("html, body").animate({ scrollTop: 0 }, "slow");
            });
        }
    }

    render() {
        const { categories, success, success_graphic_number } = this.state;

        return (
            <div className={s.wrap}>
                {success ? <div className={s.success}>
                    <div className={s.success__graphic}>
                        {success_graphic_number === 1 ? <img src={cheer1}/> : null}
                        {success_graphic_number === 2 ? <img src={cheer2}/> : null}
                        {success_graphic_number === 3 ? <img src={cheer3}/> : null}
                    </div>
                    <div className={s.success__title}>
                        <h3>Znakomicie!</h3>
                    </div>
                    <div className={s.success__text}>
                        <p>Twoja twórczość została właśnie przesłana do naszego zespołu Ekipy Kopernika! Jeżeli wszystko będzie się zgadzało, to twoje cudo za niedługo pojawi się na stronie.</p>
                    </div>
                    <div className={s.success__action}>
                        <Link to="/" className="bs-btn bs-btn--primary">Odkryj inne posty</Link>
                    </div>
                </div> : <main className={s.main}>
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
                                name="user_class"
                                placeholder="Klasa ..."
                                value={this.state.user_class}
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

                    <div className={s.content}>
                        <div className={s.content__left}>
                            <div className={cs(s.attachments, s.content__box)}>
                                <div className={s.main__header}>
                                    <h4>Treść</h4>
                                    <button>Zasady dodawania treści</button>
                                </div>
                                <div className={s.attachments__content}>
                                    <Post parentCallback={this.callbackFunction}/>
                                </div>
                            </div> 
                        </div>
                        <div className={s.content__right}>
                            <div className={s.attachments}>
                                <div className={s.main__header}>
                                    <h4>Załączniki</h4>
                                    <span>(.jpg, .jpeg, .png)</span>
                                </div>
                                <div className={s.attachments__content}>
                                    <UploadView parentFiles={this.callbackFiles} parentRemoveFile={this.removeFile} header={<div className={s.main__header}><h4>Dodane pliki</h4></div>} />
                                </div>
                            </div> 
                        </div>
                    </div>

                    {this.state.post_content.trim().length > 0 && this.state.first_name.trim().length > 0 && this.state.last_name.trim().length > 0 && this.state.user_class.trim().length > 0 && this.state.categories.filter(category => category.choosed).length > 0 ? <div className={s.submit}>
                        <button type="submit" className="bs-btn bs-btn--primary" onClick={this.submitPost}>Opublikuj</button>
                    </div> : null}
                </main> }
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