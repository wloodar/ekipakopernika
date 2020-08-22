import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import cs from 'classnames';
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
                <div className={cs(s.form__textarea, this.state.post_content.length > 2000 ? s["form__textarea--limit"] : null)}>
                    <textarea 
                        name="post_content"
                        placeholder="Twoja piękna historia ..."
                        rows="1"
                        value={this.state.post_content}
                        onChange={this.handleInputChange}
                ></textarea>
                </div>
                <div className={cs(s.form__counter, this.state.post_content.length > 2000 ? s["form__counter--visible"] : null)}>
                    <p><span>Limit przekroczony - </span> {this.state.post_content.length} / 2000</p>
                </div>
            </div>
        )
    }
}

export default withRouter(Post);