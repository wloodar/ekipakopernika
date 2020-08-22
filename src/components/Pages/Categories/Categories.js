import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import cs from 'classnames';
import { createUrl } from '../../../functions/ImageUrl';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import s from './Categories.module.scss';
import $ from 'jquery';
import _ from 'lodash';

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            loading: true,
            test: [1,1,1]
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/categories/all`, { params: { cache_id: "Categories_All" } }).then(res => {
            if (res.data.status === 1) {
                this.setState({ categories: res.data.categories, loading: false });
            }
        });
    }

    render() {
        return (
            <main className={s.main}>
                <div className={s.categories}>
                    <div className={s.ctgrid}>
                        {this.state.loading ? _.times(12, () => <div className={cs(s['ctgrid-item'], s['ctgrid-item--loading'])}>
                            <SkeletonTheme color="#EDF0F3">
                                <Skeleton/>
                            </SkeletonTheme>
                        </div>) : this.state.categories.map((obj, key) => <div className={s['ctgrid-item']}>
                            <Link to={`/kategorie/${obj.seo_url}`}></Link>
                            <div className={s['ctgrid-item__inner']}>
                                <div className={s['ctgrid-item__image']}>
                                    <img src={createUrl(obj.cover_pic, "_medium")}/>
                                    <div className={s['ctgrid-item__caption']}>
                                        <span>{obj.name}</span>
                                        <div className={s['ctgrid-item__btn']}>
                                            <p>Wybierz</p>
                                        </div>
                                    </div>
                                </div>    
                            </div>     
                        </div>) }
                    </div>
                </div>
                
            </main>
        )
    }
}

export default withRouter(Categories);