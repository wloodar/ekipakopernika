import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';

class ExactPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {}
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/posts/exact/${this.props.match.params.shortid}`).then(res => {
            if (res.data.status === 1) {
                this.setState({ post: res.data.post });
            } else {

            }
        });
    }

    render() {
        const { post } = this.state;
        console.log(post);
        
        return (
            <>
            { Object.keys(post).length !== 0 ? <Helmet>
                <title>Post {post.first_name + " " + post.last_name} w kategorii {post.category.name}</title>
            </Helmet> : null }
            </>
        )
    }
}

export default withRouter(ExactPost);