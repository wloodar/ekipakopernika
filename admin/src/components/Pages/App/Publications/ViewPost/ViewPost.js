import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import cs from 'classnames';
import Icon from '../../../../Icons/Base';
import { createUrl } from '../../../../../functions/ImageUrl';
import ShowMessage from '../../../../Partials/FlashMessages';
import s from './ViewPost.module.scss';

class EditPost extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            back_destination: "/publications",
            categories: [],
            post: {}
        };

        this.approvePost = this.approvePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/app/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: res.data.categories });
            }
        });

        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/exact/${this.props.match.params.id}`).then(res => {        
            if (res.data.status === 1) {
                this.setState({ post: res.data.post });
            }
        });
    }

    approvePost = () => {
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/update/new/accept`, { shortid: this.state.post.shortid }).then(res => {        
            if (res.data.status === 1) {
                ShowMessage({text: "Pomyślnie zaakceptowano post", type: "success"});
                this.props.history.push('/publications');
            } else {
                ShowMessage({text: "Wystąpił nieoczekiwany błąd", type: "error"});
            }
        });
    }

    deletePost = () => {
        axios.post(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/delete`, { shortid: this.state.post.shortid }).then(res => {        
            if (res.data.status === 1) {
                ShowMessage({text: "Pomyślnie usunięto post", type: "success"});
                this.props.history.push('/publications');
            } else {
                ShowMessage({text: "Wystąpił nieoczekiwany błąd", type: "error"});
            }
        });
    }

    render() {
        const { categories, post } = this.state;
        const { role } = this.props.auth.user;
        
        return (
            <div>
                <div className="b-back">
                    <Link to={this.state.back_destination}><Icon name="arrowleft"/><p>Posty</p></Link>
                </div>
                <header>
                    <div className="nbs-header">
                        {post.valid_from === null ? <h3>Oczekuje potwierdzenia</h3> : null}
                    </div>
                </header>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Dane osobowe</h5>
                    </div>  
                    <div className={s.person}>
                        {post !== {} && post.admin === null ? <ul>
                            <li><span>Imię: </span>{post.first_name}</li>
                            <li><span>Nazwisko: </span>{post.last_name}</li>
                            <li><span>Klasa: </span>{post.class}</li>
                        </ul> : post !== {} && post.admin !== undefined ? <div className={s["person-admin"]}>
                            <div className={cs(s["person-admin__image"], "user-icon", post.admin.role === "superadmin" ? 'bs-gradient--turquoise' : 'bs-gradient--pink')}>
                                <span>{post.admin.first_name.charAt(0)}</span>
                            </div>
                            <div className={s["person-admin__name"]}>
                                <h5>{post.admin.first_name + " " + post.admin.last_name} {post.admin.status === -1 ? <> - <span> <Icon name="trash"/> Konto usunięte</span></> : null}</h5>
                                <p>{post.admin.email}</p>
                            </div>
                        </div> : null}
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Wybrana kategoria</h5>
                    </div> 
                    <div className={s.category}>
                        {post.category !== undefined ? <><img src={createUrl(post.category.image, "_small")}/> <p>{post.category.name}</p></>: null}
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Treść</h5>
                    </div> 
                    <div className={s.contents}>
                        <p>{post.content}</p>
                    </div>
                </div>
                <div className="card card__tmargin--common card__apadding--common">
                    <div className="card__bsheader card__bsheader--lpadding">
                        <h5>Załączniki</h5>
                    </div> 
                    <div className={s.attachments}>
                        {post.attachments !== undefined && post.attachments.length > 0 ? post.attachments.map((val, key) => (
                            <div class={s.attachments__item}>
                                <img src={createUrl(val.attachment_url, "_small")}/>
                            </div>
                        )) : null}
                    </div>
                </div>
                <div className={s.submit}>
                    {post.valid_from === null ? <button onClick={() => this.approvePost()} className="card-form__btn card-form__btn--submit">Akceptuj post</button> : null}
                    <button onClick={() => this.deletePost()} className="card-form__btn card-form__btn--reject">{post.valid_from === null ? "Odrzuć post" : "Usuń post"}</button>
                </div>
            </div>
        )   
    }
}

EditPost.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(EditPost));
