import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import cs from 'classnames';
import Icon from '../../../../Icons/Base';

import PostRow from '../PostRow/PostRow';

class AllPosts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            posts_per_request: 15,
            pagination: true,
            current_pagination: 1
        };

        this.fetchMoreFeed = this.fetchMoreFeed.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/all`, { params: { page: 1, limit: this.state.posts_per_request }}).then(result => {
            if (result.data.posts.length > 0) {
                this.setState({ posts: result.data.posts, pagination: true });
            } else {
                this.setState({ pagination: false });
            }
        });
    }

    fetchMoreFeed() {
        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/posts/all`, { params: { page: this.state.current_pagination + 1, limit: this.state.posts_per_request }}).then(result => {
            if (result.data.posts.length === 0) {
                this.setState({ pagination: false });
            } else {
                this.setState({
                    posts: this.state.posts.concat(result.data.posts), current_pagination: this.state.current_pagination + 1
                });
            }
        })
    }

    render() {
        
        return (
            <div>
                <InfiniteScroll
                dataLength={this.state.posts.length}
                next={this.fetchMoreFeed}
                hasMore={this.state.pagination}
                loader={<div>
                    <p>Ładowanie ...</p>
                </div>}
                >
                    {this.state.posts.map((val, key) => (
                        <PostRow post={val} current_user={this.props.auth.user} key={key}/>
                    ))}
                    
                </InfiniteScroll>
            </div>
        )   
    }
}

AllPosts.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(AllPosts));
