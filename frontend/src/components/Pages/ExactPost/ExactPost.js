import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import s from './ExactPost.module.scss';

import Post from '../../Parts/Post/Post';
import NotFound from '../../Parts/NotFound/NotFound';

class ExactPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {},
            loading_post: true
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/posts/exact/${this.props.match.params.shortid}`).then(res => {
            if (res.data.status === 1) {
                this.setState({ post: res.data.post, loading_post: false });
            } else {
                this.setState({ loading_post: false });
            }
        });
    }

    render() {
        const { post, loading_post } = this.state;
        
        return (
            <>
            {loading_post ? <Post post_type={0} loading_count={1}/> : Object.keys(post).length === 0 ? <NotFound/> : null }
                <div className={s.wrap}>
                    <div className={s.sharedpost}>
                        {loading_post ? <Post post_type={0} loading_count={1}/> : Object.keys(post).length === 0 ? null : 
                            <>
                            <div className={s.sharedpost__header}>
                                <h2 className="bs-header">Post {post.first_name + " " + post.last_name}</h2>
                                <p>{moment(new Date(post.created_at)).format("DD/MM/YYYY")}</p>
                            </div>
                            <Post data={post} post_type="1"/>
                            <div className={s.explore}>
                                <Link to="/" className="bs-btn--primary">Odkryj inne posty</Link>
                            </div>
                            </>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(ExactPost);