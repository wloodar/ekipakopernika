const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateLoginData(data) {
    
    let errors = {};
    data.login = !isEmpty(data.login) ? data.login : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(Validator.isEmpty(data.login)) {
        errors.login = 'Podaj swój adres Email';
    }

    if (!Validator.isLength(data.password, {min: 6, max: 32})) {
        errors.password = "Podaj prawidłowe hasło";
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Podaj swoje hasło';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}