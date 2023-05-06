import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import s from './Inbox.module.scss';
import Icon from '../../../Icons/Base';

import MessageBubble from './MessageBubble/MessageBubble';

class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages_per_request: 20,
            messages: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_ADMIN_API_URL}/inbox/messages`, { params: { page: 1, limit: this.state.messages_per_request } }).then(result => {
            result.data.messages.forEach(el => {
                if (el.sent_by_uuid === this.props.auth.user.uuid) {
                    Object.assign(el, {current_user: true});
                } else {
                    Object.assign(el, {current_user: false});
                }
            });
            this.setState({messages: result.data.messages});           
            console.log(result);
             
        })
    }

    render() {
        const { messages } = this.state;
        return (
            <>
            {1 == 0 ? 
                <div className={s.container}>
                    <div className={s.header}>
                        <h5>Wszystkie wiadomości</h5>
                    </div>
                    <div className={s.conversation}>
                        <div className={s.conversation__chat}>
                            <div className={s.conversation__messages}>
                            {/* <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> s */}
                                {messages.map((val, key) => 
                                    <MessageBubble message={val} key={key}/>
                                )}
                            </div>
                        </div>  
                        <div className={s.convbar}>
                            <div className={s.convbar__useractions}>
                                <div className={s.convbar__controls}>
                                    <div className={s.convbar__attach}>
                                        <div className={s.convbar__attachitem}>
                                            <label for="file-input__image">
                                                <Icon name="image"/>
                                            </label>
                                            <input id="file-input__image" type="file" accept="image/x-png,image/gif,image/jpeg"/>
                                        </div>
                                        <div className={s.convbar__attachitem}>
                                            <label for="file-input__pdf">
                                                <Icon name="paperclip"/>
                                            </label>
                                            <input id="file-input__pdf" type="file" accept="application/pdf,application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
                                        </div>
                                    </div>
                                    <div className={s.convbar__textmessage}>
                                        <input
                                            type="text"
                                            name="user_message"
                                            placeholder="Twoja wiadomość ..."
                                            autocapitalize="sentences"
                                        />
                                    </div>  
                                </div>
                                <div className={s.convbar__send}>
                                    <button>Wyślij</button>
                                </div>
                            </div>  
                        </div>  
                    </div>
                    <div className={s.files}>

                    </div>
                </div> : null }
                <header>
                    <div className="nbs-header">
                        <h3>Wiadomości</h3>
                        <p>Prace nad tą funkcjonalnością trwają ...</p>
                    </div>
                </header>
            </> 
        )   
    }
}

Inbox.propTypes = {
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Inbox));
