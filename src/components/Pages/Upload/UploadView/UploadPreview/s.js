import React, {useEffect} from 'react';
import s from './UploadPreview.module.scss';
import $ from 'jquery';

async function createImagePreview(file) {
    const prev = new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file); 

        reader.onload = function(e) {
            console.log(e.target.result);
            resolve(<img src={e.target.result}/>);
        }
    }); 
}

function UploadPreview(props) {

    const imagePreview = async(file) => (
        <div className={s.item__image}>
            {console.log(await createImagePreview(file))}
        </div>
    );

    const previews = props.files.map((file, key) => (
        <div className={s.item}>
            {file.type.indexOf("image/") !== -1 ? imagePreview(file) : null}
        </div>
    ));

    return (
        <div>   
            {previews}
        </div>
    )
}

export default UploadPreview;