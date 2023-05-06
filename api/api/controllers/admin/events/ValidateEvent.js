const Validator = require('validator');
const isEmpty = require('../../../components/Validation/isEmpty');

module.exports = function validateCreation(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.place = !isEmpty(data.place) ? data.place : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = "Proszę podaj nazwę wydarzenia"; 
    }

    if (!Validator.isLength(data.name, { min: 3, max: 128 })) {
        errors.name = "Proszę podaj poprawną nazwę wydarzenia (od 3 do 128 znaków)";
    }

    if (Validator.isEmpty(data.place)) {
        errors.place = "Proszę podaj miejsce wydarzenia";
    }

    if (!Validator.isLength(data.place, { max: 128 })) {
        errors.place = "Proszę podaj poprawne miejsce wydarzenia / maks 128 znaków";
    }

    if (data.ufiles === '') {
        errors.ufiles = "Proszę wybierz zdjęcie dla wydarzenia"; 
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = "Proszę podaj opis wydarzenia";
    }

    if (!Validator.isLength(data.description, { max: 2000 })) {
        errors.description = "Opis nie może zawierać więcej niż 2000 znaków";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
