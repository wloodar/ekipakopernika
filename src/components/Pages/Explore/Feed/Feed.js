import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import { format } from 'timeago.js';
import { createUrl } from '../../../../functions/ImageUrl';
import Zoom, { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReadMore from '@crossfield/react-read-more';

import $ from 'jquery';
import s from './Feed.module.scss';

function Feed(props) {

    const largeImage = (e, attach_url) => {
        // e.preventDefault();
        // $(e.target).parent().find("img").attr("src", createUrl(attach_url, "_large"));
    }

    const ordinaryPost = (data) => (
        <><div className={s["ordinary-name"]}>
            <div className={s["ordinary-name__icon"]}>
                <Link to={"/kategorie/" + data.category.seo_url}><img src={createUrl(data.category.image, "_cropped-small")}/></Link>
            </div>
            <div className={s["ordinary-name__person"]}>
                <h5><Link to={"/kategorie/" + data.category.seo_url}>{data.category.name}</Link></h5>
                <p>{data.first_name + " " + data.last_name}</p>
            </div>  
            <div className={s["ordinary-name__date"]}>
                {/* <p>2 min</p> */}
            </div>
        </div>
        <div className={s["ordinary-content"]}>
            {/* <p>{data.content}</p> */}
            <ReadMore
                initialHeight={200}
                readMore={props => (
                    <button onClick={props.onClick}>{props.open ? 'Ukryj tekst' : 'Czytaj więcej'}</button>
                )}
                >
                <p>
                    {data.content}
                </p>
            </ReadMore>
        </div>
        {/* <div className={s["ordinary-images"]} style={(data.attachments.length === 1 ? { gridTemplateColumns: "auto" } : null)}> */}
        <div className={cs(s["ordinary-images"], data.attachments.length === 1 ? s["ordinary-images__single"] : s["ordinary-images__multiple"])}>
            {/* {data.attachments.map((val, key) => (
                <div className={cs(s["ordinary-images__item"], data.attachments.length === 1 ? null : s["ordinary-images__item--multiple"], "feed-large-photo")} key={key} onClick={(e) => {largeImage(e, val.attachment_url)}}>
                    <Zoom zoomMargin={40}>
                        <img src={createUrl(val.attachment_url, data.attachments.length === 1 ? "_medium" : "_small")} title="test"/>
                    </Zoom>
                </div>
            ))} */}

            {data.attachments.map((val, key) => (
                <div className={s["ordinary-images__item"]}>
                    <LazyLoadImage
                        src={createUrl(val.attachment_url,  data.attachments.length === 1 ? "_medium" : "_small")} // use normal <img> attributes as props
                        effect="blur"
                    />
                </div>
            ))}
        </div>
        <div className={s["ordinary-bottom"]}>
            <div className={s["ordinary-bottom__date"]}>
                <p>{format(new Date(data.created_at))}</p>
            </div>
            <div className={s["ordinary-bottom__action"]}>
                <button>Udostępnij</button>
            </div>
        </div>
        </>
    );

    const previews = props.data.map((item, key) => (
        <div className={s.item} key={key}>
            {item.post_type === 1 ? ordinaryPost(item) : null}
        </div>
    ));

    return (
        <>{previews}</>
    )
}

export default Feed;