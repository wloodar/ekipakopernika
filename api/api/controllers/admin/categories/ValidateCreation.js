const Validator = require('validator');
const isEmpty = require('../../../components/Validation/isEmpty');

module.exports = function validateCreation(data) {
    let errors = {};

    data.status = !isEmpty(data.status) ? data.status : '';
    data.create_name = !isEmpty(data.create_name) ? data.create_name : '';
    data.processed_files = !isEmpty(data.processed_files) ? data.processed_files : '';
    data.create_description = !isEmpty(data.create_description) ? data.create_description : '';
     
    if (data.status != 0 && data.status != 1) {
        throw new Error;
    }

    if (Validator.isEmpty(data.create_name)) {
        errors.create_name = "Proszę podaj nazwę kategorii"; 
    }

    if (!Validator.isLength(data.create_name, { min: 1, max: 64 })) {
        errors.create_name = "Proszę podaj poprawną nazwę kategorii (od 1 do 64 znaków)";
    }

    if (data.processed_files.length === 0) {
        errors.ufiles = "Proszę wybierz zdjęcie dla kategorii"; 
    }

    if (!Validator.isLength(data.create_description, { max: 256 })) {
        errors.create_description = "Opis nie może zawierać więcej niż 256 znaków";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
