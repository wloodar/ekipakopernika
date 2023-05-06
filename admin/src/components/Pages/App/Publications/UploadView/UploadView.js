import React, { Component, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import s from './UploadView.module.scss';
import Dropzone from 'react-dropzone';
import UploadPreview from '../UploadPreview/UploadPreview';

class UploadView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };

        this.handleAttachedFiles = this.handleAttachedFiles.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }

    handleAttachedFiles(files) {
        files.forEach((val) => {              
            if (val.type.indexOf('image/') !== -1) {
                // Object.assign(val, {preview: URL.createObjectURL(val)});

                const oldFiles = this.state.files;
                oldFiles.push(val);
                this.setState({ files: oldFiles });
                
                this.props.parentFiles(val);
            } else {
                alert("Narazie akceptujemy wyłącznie zdjęcia, niedługo coś nowego się pojawi ;)");
            }
        });
    }

    removeFile(file) {
        const { files } = this.state;
        const index = files.findIndex(fl => fl.path === file.path);
        let filesCopy = [...this.state.files];
        filesCopy.splice(index, 1);
        this.setState({ files: filesCopy });     
        
        this.props.parentRemoveFile(file);
    }

    dropRejected() {
        alert('Narazie akceptujemy wyłącznie zdjęcia, niedługo coś nowego się pojawi ;)');
    }

    render() {

        return (
            <>
                <Dropzone onDrop={acceptedFiles => this.handleAttachedFiles(acceptedFiles)} accept={'.jpeg,.png,.jpg'} onDropRejected={this.dropRejected}>
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} className={s.drop}>
                        <input {...getInputProps()} />
                        <p>Przeciągnij tutaj pliki lub kliknij żeby wybrać.</p>
                    </div>
                )}
                </Dropzone>
                <div className={s.files}>
                    <UploadPreview files={this.state.files} removeFileParent={this.removeFile}/>
                </div>
            </>
        )
    }
}

export default withRouter(UploadView);