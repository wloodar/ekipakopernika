import React from 'react';
import cs from 'classnames';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { createUrl } from '../../../../../functions/ImageUrl';
import s from './PostRow.module.scss';

function PostRow(props) {
    return (
        <div className={s.item} key={props.key}>
            <Link to={`/publications/${props.post.shortid}/view`}></Link>
            <div className={s.item__inner}>
                <div className={s.item__image}>
                    <LazyLoadImage
                        src={createUrl(props.post.attachments[0].attachment_url, "_cropped-large")}
                        effect="blur"
                    />
                </div>
                <div className={s.item__details}>
                    <div className={s.item__name}>
                        <h5>{props.post.first_name + " " + props.post.last_name + " " + (props.post.class !== null ? props.post.class : "")}</h5>
                        <span className={props.post.admin !== null && props.post.admin.role === "superadmin" ? 'bs-gradient--turquoise' : props.post.admin !== null ? 'bs-gradient--pink' : null}>{props.post.class === null ? props.post.admin.uuid === props.current_user.uuid ? "Ty" : props.post.admin.role : null}</span>
                    </div>
                    <div className={s.item__content}>
                        <p><span>{props.post.category.name}</span>{props.post.content}</p>
                    </div>
                </div>
                <div className={s.item__time}>
                    <p>{format(new Date(props.post.created_at))}</p>
                    <span className={props.post.valid_from === null && props.post.valid_until === null ? cs(s["item-approve"], s["item-approve--negative"]) : cs(s["item-approve"], s["item-approve--positive"])}></span>
                </div>
            </div>
        </div>
    )
}

export default PostRow;