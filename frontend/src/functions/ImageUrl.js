exports.createUrl = (image, size) => { 
    return process.env.REACT_APP_GLOBAL_UPLOAD_URL + "/" + image.substr(0, 2) + "/" + image.split('.')[0] + "/" + image.split('.')[0] + size + "." + image.split('.')[1];
}