import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import Feed from '../Feed/Feed';
import Post from '../../../Parts/Post/Post';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import s from './Posts.module.scss';

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading_feed: true,
            pagination: false,
            current_pagination: 1,
            posts_per_request: this.props.limit && this.props.limit <= 10 ? this.props.limit : 6
        };

        this.fetchMoreFeed = this.fetchMoreFeed.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}${this.props.apiUrl}`, { params: { page: 1, limit: this.state.posts_per_request }}).then(result => {
            if (result.data.posts.length > 0) {
                this.setState({ posts: result.data.posts, loading_feed: false, pagination: true });
            } else {
                this.setState({ pagination: false, loading_feed: false });
            }
        });
    }

    fetchMoreFeed() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}${this.props.apiUrl}`, { params: { page: this.state.current_pagination + 1, limit: this.state.posts_per_request }}).then(result => {
            if (result.data.posts.length === 0) {
                this.setState({ pagination: false, loading_feed: false });
            } else {
                this.setState({
                    posts: this.state.posts.concat(result.data.posts), current_pagination: this.state.current_pagination + 1, loading_feed: false
                });
            }
        })
    }

    render() {
        const { loading_feed } = this.state;
        return (
            <>{loading_feed ? <Post post_type={0} loading_count={3}/> : <InfiniteScroll
                dataLength={this.state.posts.length}
                next={this.fetchMoreFeed}
                hasMore={this.state.pagination}
                loader={<div className={s.loading}>
                    <SkeletonTheme color="#EDF0F3">
                        <Skeleton />
                    </SkeletonTheme>
                    <p>Ładowanie postów ...</p>
                </div>}
            >
                <Feed data={this.state.posts}/>
            </InfiniteScroll>}</>
        )
    }
}

export default withRouter(Posts);