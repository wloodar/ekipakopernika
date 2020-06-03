import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import MediumEditor from 'medium-editor';
import s from './Article.module.scss';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

class Article extends Component {

    constructor(props) {
        super(props);
        this.state = {
            a_title: "",
            a_subtitle: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.preventTitleEnter = this.preventTitleEnter.bind(this);
    }
    
    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        if (current_target === "a_title") {
            if (e.keyCode == 13 && !e.shiftKey)
            {
            e.preventDefault();
            return false;
            }
            e.target.style.cssText = 'height:auto; padding:0';
            e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
        }

        this.setState({ [e.target.name]: e.target.value });
    }

    preventTitleEnter(e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            return false;
        }
    }

    componentDidMount() {
        var editor = new MediumEditor('.editable');
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <div className={s.article}>
                <div className={s.title}>
                    <textarea 
                        name="a_title"
                        placeholder="Tytuł"
                        rows="1"
                        value={this.state.a_title}
                        onChange={this.handleInputChange}
                        onKeyDown={this.preventTitleEnter}
                    ></textarea>
                </div>
                <div className={s['sub-title']}>
                    <input 
                        type="text"
                        name="a_subtitle"
                        placeholder="Podtytuł"
                        value={this.state.a_subtitle}
                        onChange={this.handleInputChange}
                    />
                </div>
                <div className="editable">
                
                </div>
            </div>
        )
    }
}

export default withRouter(Article);