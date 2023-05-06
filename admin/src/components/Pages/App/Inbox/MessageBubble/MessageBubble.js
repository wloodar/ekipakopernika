import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../../Icons/Base';
import s from './MessageBubble.module.scss';
import TestImg from './test.png';

function MessageBubble(props) {

    const textMessage = () => (
        <div className={s.item__bubble}>
            <p>{props.message.message}</p>
        </div>
    );  

    const documentMessage = () => (
        <div className={[s.item__bubble, s['item__bubble--document']].join(' ')}>
            <Link to=""><Icon name="download"/>{props.message.attachment_name + "." + props.message.attachment_ext} <span>{props.message.attachment_size}</span></Link>
        </div>
    );

    const imageMessage = () => (
        <div className={[s.item__bubble, s['item__bubble--image']].join(' ')}>
            <img src={TestImg} alt=""/>
        </div>
    );

    return (
        <div className={[s.item, props.message.current_user ? s.item__you : null].join(' ')}>
            <div className={[s.item__person, props.message.sent_by_role === "superadmin" ? s['item__person--superadmin'] : s['item__person--admin']].join(' ')}>
                <span>{props.message.first_name.charAt(0)}</span>
            </div>
            <div className={s.item__message}>
                {props.message.message !== "" ? textMessage() : null }
                {props.message.attachment_ext === "png" && props.message.message === "" ? imageMessage() : null }
                {props.message.attachment_ext === "pdf" && props.message.message === "" ? documentMessage() : null }
                <div className={s.item__date}>
                    <p>{props.message.current_user ? null : props.message.first_name + " " + props.message.last_name + " | "}1 min</p>
                </div>
            </div>
        </div>
    )   
}

export default MessageBubble;