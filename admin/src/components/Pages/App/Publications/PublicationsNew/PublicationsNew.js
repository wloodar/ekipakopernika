import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import cs from 'classnames';
import { createUrl } from '../../../../../functions/ImageUrl';
import Icon from '../../../../Icons/Base';
import ShowMessage from '../../../../Partials/FlashMessages';
import s from './PublicationsNew.module.scss';

import UploadView from '../UploadView/UploadView';

class PublicationsNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            files: [],
            post_content: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.chooseCategory = this.chooseCategory.bind(this);
        this.callbackFiles = this.callbackFiles.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.submitPost = this.submitPost.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/app/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            console.log(res);
            
            if (res.data.status === 1) {
                this.setState({ categories: res.data.categories });
            }
        });
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        this.setState({ [e.target.name]: e.target.value });
        
        e.target.style.cssText = 'height:auto;';
        e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
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

    chooseCategory(categoryId) {     
        const categoryIndex = this.state.categories.findIndex(c => c.id === categoryId);
        const categoriesCopy = [...this.state.categories];       
        for (let i = 0; i < categoriesCopy.length; i++) {
            categoriesCopy[i].choosed = false;
        }
        categoriesCopy[categoryIndex].choosed = true;
        this.setState({ categories: categoriesCopy });
    }

    submitPost = async (e) => {
        e.preventDefault(); 
        const formData = new FormData();
        const { categories, post_content, files } = this.state; 
        const { first_name, last_name } = this.props.auth.user;
        const choosedCategory = await categories.filter(category => category.choosed);        

        if (choosedCategory.length > 0) {
            for(var x = 0; x<files.length; x++) {
                formData.append('ufiles', files[x])
            }
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("user_class", null);
            formData.append("category_id", choosedCategory[0].id);
            formData.append("post_content", post_content);
            
            axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/app/posts/create`, formData, {headers: { 'Content-Type': 'multipart/form-data' }}).then(result => {
                ShowMessage({text: "Pomyślnie dodano post!", type: "success"});
                this.props.history.push('/publications');
            });
        }
    }

    render() {
        const { categories } = this.state;
        const { role } = this.props.auth.user;
        return (
            <>
                <div className="b-back">
                    <Link to="/publications"><Icon name="arrowleft"/><p>Posty</p></Link>
                </div>
                <header>
                    <div className="nbs-header">
                        <h3>Stwórz nowy post</h3>
                        <p>Pamiętaj o naszych zasadach odnośnie postów</p>
                    </div>
                </header>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Wybierz kategorie</h5>
                    </div>  
                    <div className={s["categories-grid"]}>
                        {categories.map((obj, key) => <div className={cs(s["categories-item"], obj.choosed !== undefined && obj.choosed ? s["categories-item--active"] : null)} onClick={this.chooseCategory.bind(this, obj.id)} key={obj.id}>
                            <img src={createUrl(obj.cover_pic, "_small")}/>
                            <div className={s["categories-item__name"]}>
                                <p>{obj.name}</p>
                                <span>wybrana</span>
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--spadding">
                        <h5>Treść</h5>
                    </div>  
                    <div className="contents card-form__row card-form__row--fwidth">
                        <textarea 
                            name="post_content"
                            placeholder="Twoje piękna opowieść ..."
                            rows="1"
                            value={this.state.post_content}
                            onChange={this.handleInputChange}
                        ></textarea>
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Załączniki</h5>
                    </div>  
                    <UploadView parentFiles={this.callbackFiles} parentRemoveFile={this.removeFile}/>
                </div>
                <div className="card-form__row clearfix">
                    {this.state.post_content.trim().length > 0 && this.state.categories.filter(category => category.choosed).length > 0 ? <div className={s.submit}>
                        <button type="submit" className="card-form__btn card-form__btn--submit card-form__btn--right" onClick={this.submitPost}>Opublikuj</button>
                    </div> : null}
                </div>
            </> 
        )   
    }
}

PublicationsNew.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(PublicationsNew));
