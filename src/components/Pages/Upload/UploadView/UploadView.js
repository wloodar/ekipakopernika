import React, { Component, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import s from './UploadView.module.scss';
import Dropzone from 'react-dropzone';
import UploadPreview from './UploadPreview/UploadPreview';

class UploadView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };

        this.handleAttachedFiles = this.handleAttachedFiles.bind(this);
    }

    handleAttachedFiles(files) {
        files.forEach((val) => {              
            if (val.type.indexOf('image/') !== -1) {
                Object.assign(val, {preview: URL.createObjectURL(val)});
            } 
            if (val.type.indexOf('application/pdf') !== -1) {
                // Object.assign(val, {preview: URL.createObjectURL(val)});
            }
            if (val.type.indexOf('video/mp4') !== -1) {
                // Object.assign(val, {preview: URL.createObjectURL(val)});
            } 
        });

        this.setState(prevState => ({
            files: [...prevState.files, ...files]
        }))      
    }

    render() {

        return (
            <>
                <Dropzone onDrop={acceptedFiles => this.handleAttachedFiles(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} className={s.drop}>
                        <input {...getInputProps()} />
                        <p>Przeciągnij tutaj pliki lub kliknij żeby wybrać.</p>
                    </div>
                )}
                </Dropzone>
                {this.state.files.length > 0 ? this.props.header : null}
                <div className={s.files}>
                    <UploadPreview files={this.state.files}/>
                </div>
            </>
        )
    }
}

export default withRouter(UploadView);