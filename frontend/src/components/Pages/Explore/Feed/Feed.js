import React from 'react';
import 'react-medium-image-zoom/dist/styles.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import s from './Feed.module.scss';

import Post from '../../../Parts/Post/Post';

function Feed(props) {

    const ordinaryPost = (data) => (
        <Post data={data} post_type="1"/>
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