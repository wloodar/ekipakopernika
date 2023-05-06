import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cs from 'classnames';
import axios from 'axios';
import $ from 'jquery';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import _ from 'lodash';
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
            loading_categories: true,
            post_content: "",
            files: [],
            errors: {},
            uploading: false,
            uploading_progress: 0,
            uploaded_shortid: "",
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
                this.setState({ categories: res.data.categories, loading_categories: false });
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
            
            $("html, body").animate({ scrollTop: 0 }, 500);
            axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/posts/create`, formData, {headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.setState({ uploading: true, uploading_progress: percentCompleted });
            }}).then(result => {
                console.log(result);  
                this.setState({ success: true, uploading: false, uploaded_shortid: result.data.post_id });
                $("html, body").animate({ scrollTop: 0 }, "slow");
            });
        }
    }

    render() {
        const { categories, loading_categories, uploading, success, success_graphic_number } = this.state;

        return (
            <div className={s.wrap}>
                {uploading === false && success ? <div className={s.success}>
                    <div className={s.success__graphic}>
                        {success_graphic_number === 1 ? <img src={cheer1}/> : null}
                        {success_graphic_number === 2 ? <img src={cheer2}/> : null}
                        {success_graphic_number === 3 ? <img src={cheer3}/> : null}
                    </div>
                    <div className={s.success__title}>
                        <h3>Znakomicie!</h3>
                    </div>
                    <div className={s.success__text}>
                        <p>Twoja twórczość została właśnie przesłana do naszego zespołu Ekipy Kopernika! Jeżeli wszystko będzie się zgadzało, to twoje cudo niedługo pojawi się na stronie.</p>
                    </div>
                    <div className={s.success__post}>
                        <h6>Twój post znajduje się pod tym adresem.</h6>
                        <p>{"http://ekipakopernika.pl/" + this.state.uploaded_shortid}</p>
                    </div>
                    <div className={s.success__action}>
                        <Link to="/" className="bs-btn bs-btn--primary">Odkryj posty</Link>
                    </div>
                </div> : null}

                {uploading ? <div className={s.uploading}>
                    <div className={s.uploading__box}>
                        <div className={s.uploading__text}>
                            {this.state.uploading_progress <= 50 ? <p>Twój post wędruje na serwer ...</p> : null}
                            {this.state.uploading_progress > 50 && this.state.uploading_progress <= 90 ? <p>Już coraz bliżej ...</p> : null}
                            {this.state.uploading_progress > 90 ? <p>Ostatnie formalności ...</p> : null}
                        </div>
                        <div className={s.uploading__indicator}>
                            <div className={s["uploading__indicator--bar"]} style={{ "width": this.state.uploading_progress + "%" }}></div>
                        </div>
                    </div>
                    <div className={cs(s.uploading__blob, s["uploading__blob--topcenter"])}>
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4B63D3" d="M46.5,-76.8C60,-72.6,70.7,-59.8,77.9,-45.6C85,-31.3,88.6,-15.7,89.3,0.4C90,16.5,87.8,33,78.4,43.2C68.9,53.3,52.1,57.2,37.8,62.8C23.5,68.5,11.8,75.8,-2,79.3C-15.7,82.7,-31.4,82.1,-42.4,74.6C-53.3,67,-59.6,52.5,-66.4,38.9C-73.2,25.3,-80.6,12.7,-79.8,0.4C-79.1,-11.8,-70.3,-23.7,-62.6,-35.7C-54.9,-47.7,-48.3,-60,-38,-66C-27.8,-72,-13.9,-71.9,1.3,-74.1C16.4,-76.3,32.9,-80.9,46.5,-76.8Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <div className={cs(s.uploading__blob, s["uploading__blob--rightdown"])}>
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4B63D3" d="M48.8,-60.4C61.4,-47.6,68.5,-30.5,71.7,-12.6C75,5.3,74.3,23.9,66,37.8C57.6,51.8,41.6,61.1,24.8,66.4C8,71.8,-9.6,73.3,-27.7,69.6C-45.8,65.9,-64.4,56.9,-75.3,41.7C-86.2,26.5,-89.5,5.1,-81.9,-10.3C-74.3,-25.7,-55.8,-35,-40.3,-47.4C-24.8,-59.8,-12.4,-75.1,2.8,-78.5C18.1,-81.9,36.2,-73.3,48.8,-60.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                    <div className={cs(s.uploading__blob, s["uploading__blob--leftdown"])}>
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4B63D3" d="M44.1,-63C57.6,-50.8,69.3,-38.6,76.1,-23.4C82.9,-8.2,84.7,10,78.2,24C71.7,38.1,56.9,48.1,42.5,58.8C28.1,69.6,14.1,81.1,-0.7,82.1C-15.5,83.2,-31.1,73.7,-46.4,63.2C-61.7,52.7,-76.7,41.3,-79.9,27C-83.1,12.7,-74.6,-4.4,-67.6,-20.8C-60.7,-37.2,-55.3,-53,-44.3,-66C-33.3,-79,-16.6,-89.2,-0.7,-88.3C15.3,-87.3,30.6,-75.2,44.1,-63Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                </div> : null}

                {uploading === false && success === false ? 
                <>
                <div className={s.main__toph}>
                        <h2>Podziel się </h2>
                    </div>
                <main className={s.main}>
                    

                    <div className={s.person__container}>
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
                    </div>

                    <div className={s.categories}>
                        <div className={s.main__header}>
                            <h4>Wybierz kategorie</h4>
                        </div>
                        <div className={s.categories__grid}>
                            {this.state.loading_categories ? _.times(12, () => <div className={cs(s.categories__item, s['categories__item--loading'])}>
                                <SkeletonTheme color="#EDF0F3">
                                    <Skeleton/>
                                </SkeletonTheme>
                            </div>) : categories.map((obj, key) => <div className={cs(s.categories__item, obj.choosed !== undefined && obj.choosed ? s["categories__item--active"] : null)} onClick={this.chooseCategory.bind(this, obj.id)} key={obj.id}>
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
                                    <span>(.jpg, .jpeg, .png) - 10mb</span>
                                </div>
                                <div className={s.attachments__content}>
                                    <UploadView parentFiles={this.callbackFiles} parentRemoveFile={this.removeFile} header={<div className={s.main__header}><h4>Dodane pliki</h4></div>} />
                                </div>
                            </div> 
                        </div>
                    </div>

                    {this.state.post_content.trim().length > 0 && this.state.post_content.length <= 2000 && this.state.first_name.trim().length > 0 && this.state.last_name.trim().length > 0 && this.state.user_class.trim().length > 0 && this.state.categories.filter(category => category.choosed).length > 0 ? <div className={s.submit}>
                        <button type="submit" className="bs-btn bs-btn--primary" onClick={this.submitPost}>Opublikuj</button>
                        <p>Publikując, oświadczam, że jestem autorem tekstu oraz załączonego materiału/materiałów.</p>
                    </div> : null}
                </main></> : null }
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