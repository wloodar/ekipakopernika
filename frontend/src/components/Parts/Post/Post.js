import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import { format } from 'timeago.js';
import { createUrl } from '../../../functions/ImageUrl';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

import s from './Post.module.scss';

function Post(props) {

    const { data } = props;
    const [buttonText, setButtonText] = useState("Skopiuj");
    const changeText = (text) => setButtonText(text);

    const ordinaryPost = () => (
        <div className={s.item}>
            <div className={s["ordinary-name"]}>
                <div className={s["ordinary-name__info"]}>
                    <div className={s["ordinary-name__icon"]}>
                        <Link to={"/kategorie/" + data.category.seo_url}><img src={createUrl(data.category.image, "_cropped-small")}/></Link>
                    </div>
                    <div className={s["ordinary-name__person"]}>
                        <h5><Link to={"/kategorie/" + data.category.seo_url}>{data.category.name}</Link></h5>
                        <p>{data.first_name + " " + data.last_name}</p>
                    </div>  
                </div>
                <div className={s["ordinary-name__date"]}>
                    <p>{format(new Date(data.created_at))}</p>
                </div>
            </div>
            <div className={s["ordinary-content"]}>
                <p>
                    {data.content}
                </p>
            </div>

            <div className={s["ordinary-images"]}>
                {data.attachments.length !== 0 && data.attachments.length === 1 ? <div className={cs(s["ordinary-images__item"], s["ordinary-images__item--single"])}>
                    <LazyLoadImage
                                src={createUrl(data.attachments[0].attachment_url,  data.attachments[0].length === 1 ? "_medium" : "_small")} // use normal <img> attributes as props
                                effect="blur"
                    /></div> : null}
                {data.attachments.length !== 0 && data.attachments.length > 1 ? <Carousel showStatus={false} showThumbs={false} dynamicHeight={true} >
                    {data.attachments.map((val, key) => (
                        <div className={s["ordinary-images__item"]}>
                            <LazyLoadImage
                                src={createUrl(val.attachment_url,  data.attachments.length === 1 ? "_medium" : "_small")} // use normal <img> attributes as props
                                effect="blur"
                            />
                        </div>
                    ))}
                </Carousel> : null}
            </div>

            <div className={s["ordinary-share"]}>
                <div className={s["ordinary-share__info"]}>
                    <div className={s["ordinary-share__header"]}>
                        <h5>Udostępnij post: {data.first_name + " " + data.last_name}</h5>
                    </div>
                    <div className={s["ordinary-share__link"]}>
                        <p>{"http://ekipakopernika.wlodev.com/" + data.shortid}</p>
                    </div>
                </div>
                <div className={s["ordinary-share__action"]}>
                    <CopyToClipboard text={process.env.REACT_APP_GLOBAL_URL + "/" + data.shortid}>
                        <button className="bs-btn bs-btn--primary" onClick={(e) => {changeText("Skopiowano"); setTimeout(() => {
                            changeText("Skopiuj");
                        }, 700);}}>{buttonText}</button>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    );

    const loadingPost = () => (
        <div className={s.item}>
            <div className={s["ordinary-name"]}>                
                <div className={s["ordinary-name__info"]}>
                    <div className={s["ordinary-name__icon"]}>
                        <Link><SkeletonTheme color="#EDF0F3">
                            <Skeleton height={300}/>
                        </SkeletonTheme></Link>
                    </div>
                    <div className={s["ordinary-name__person"]}>
                        <h5 style={{ paddingBottom: "5px", paddingTop: "5px" }}><SkeletonTheme color="#4B63D3">
                            <Skeleton height={20} width={100}/>
                        </SkeletonTheme></h5>
                        <p>
                        <SkeletonTheme color="#EDF0F3">
                            <Skeleton/>
                        </SkeletonTheme>
                        </p>
                    </div>  
                </div>
                <div className={s["ordinary-name__date"]}>
                    <p>
                    <SkeletonTheme color="#EDF0F3">
                        <Skeleton width={50}/>
                    </SkeletonTheme>
                    </p>
                </div>
            </div>
            <div className={s["ordinary-content"]}>
                <SkeletonTheme color="#EDF0F3">
                    <Skeleton height={370}/>
                </SkeletonTheme>
            </div>
            <div style={{ height: "12px" }}></div>
            <SkeletonTheme color="#EDF0F3">
                <Skeleton height={52}/>
            </SkeletonTheme>
        </div>
    );

    return (
        <>{props.post_type === "1" ? ordinaryPost() : _.times(props.loading_count, () => loadingPost())}</>
    )
}

export default Post;