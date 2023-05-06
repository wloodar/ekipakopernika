import React, {useEffect} from 'react';
// import { Document, Page } from 'react-pdf';
import s from './UploadPreview.module.scss';
import $ from 'jquery';

import Icon from '../../../../Icons/Base';

function UploadPreview(props) {

    const imagePreview = (file) => (
        <div className={s.item__image}>
            <img src={URL.createObjectURL(file)} onLoad={() => setTimeout(() => {
                window.URL.revokeObjectURL(file)
            }, 100)}/>
            <div className={s.item__overlay}>
                <div className={s.item__bottom}>
                    <Icon name="image"/>
                    <button onClick={() => removeImage(file, props)}>Usuń</button>
                </div>
            </div>
        </div>
    );

    const pdfPreview = (file) => (
        // <div>
        //     {getBase64(file, (result) => (
        //         <Document file={result}></Document>
        //     ))}
        // </div>
        <></>
    );

    const previews = props.files.map((file, key) => (
        <div className={s.item} key={key}>
            {file.type.indexOf("image/") !== -1 ? imagePreview(file) : null}
            {/* {file.type.indexOf("application/pdf") !== -1 ? pdfPreview(file) : null} */}
        </div>
    ));

    return (
        <>
            {previews}
        </>
    )
}

const removeImage = (file, props) => {
    props.removeFileParent(file);
}

function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
            fetch(`data:application/pdf;base64,${reader.result.split(',')[1]}`).then(res => {
                res.blob().then(blob => {
                    cb(blob);
                });
            })
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


export default UploadPreview;