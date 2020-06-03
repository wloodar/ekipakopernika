import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { createUrl } from '../../../../functions/ImageUrl';
import s from './CategoriesDetails.module.scss';

class CategoriesDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            category_url: "",
            category_name: ""
        };
    }

    componentDidUpdate(prevProps, prevState) {   
        if (this.props.match.params.name !== this.state.category_url){
            this.state.categories.forEach(el => {
                if (this.props.match.params.name === el.seo_url) {
                    this.setState({ category_url: this.props.match.params.name, category_name: el.name });
                }
            }); 
        }
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            if (res.data.status === 1) {
                res.data.categories.forEach(el => {
                    if (this.props.match.params.name === el.seo_url) {
                        this.setState({ categories: res.data.categories, category_url: this.props.match.params.name, category_name: el.name });
                    }
                });
            }
        });
    }

    render() {
        const { categories, category_name } = this.state;
        return (
            <div className={s.wrapper}>
                <div className={s.info}>
                    <div className={s.info__back}>
                        <Link to="/kategorie">{"< Wszystkie kategorie"}</Link>
                    </div>
                    {categories.map((val, key) => (val.seo_url === this.state.category_url ? <div className={s.info__current} style={{ background: `url(${createUrl(val.cover_pic, "_large")})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}>
                        <div className={s["info__current-name"]}>
                            <p>{val.name}</p>
                        </div>
                    </div> : null) )}
                    <div className={s.info__others}>
                        <h5>Inne kategorie</h5>
                        {categories.map((val, key) => (val.seo_url !== this.state.category_url ? <div className={s.info__othersitem} style={{ background: `url(${createUrl(val.cover_pic, "_large")})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}>
                            <Link to={`/kategorie/${val.seo_url}`}>
                                <div className={s["info__othersitem-name"]}>
                                    <p>{val.name}</p>
                                </div>
                            </Link>
                        </div> : null) )}
                    </div>
                </div>
                <div className={s.feed}>
                    <div className={s.feed__inner}>
                        <div className={s.feed__header}>
                            <h4>{category_name}</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(CategoriesDetails);