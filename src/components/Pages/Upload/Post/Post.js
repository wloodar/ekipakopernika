import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import s from './Post.module.scss';

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post_content: ""
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    sendData = (val) => {
        this.props.parentCallback(val);
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        this.setState({ [e.target.name]: e.target.value });

        this.sendData(e.target.value);

        e.target.style.cssText = 'height:auto;';
        e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
    }

    render() {
        return (
            <div className={s.form}>
                <div className={s.form__textarea}>
                    <textarea 
                        name="post_content"
                        placeholder="Twoje piękna historia ..."
                        rows="1"
                        value={this.state.post_content}
                        onChange={this.handleInputChange}
                ></textarea>
                </div>
            </div>
        )
    }
}

export default withRouter(Post);