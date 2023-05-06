const Validator = require('validator');
const isEmpty = require('../../../components/Validation/isEmpty');

module.exports = function validateAdminCreate(data) {
    let errors = {};
    
    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.role = !isEmpty(data.role) ? data.role : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.first_name, { min: 1, max: 32 })) {
        errors.first_name = "Proszę podać poprawne imię osoby";
    }

    if (Validator.isEmpty(data.first_name)) {
        errors.first_name = "Proszę podać imię osoby";
    }

    if (!Validator.isLength(data.last_name, { min: 1, max: 32 })) {
        errors.last_name = "Proszę podać poprawne nazwisko osoby";
    }

    if (Validator.isEmpty(data.last_name)) {
        errors.last_name = "Proszę podać nazwisko osoby";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "Proszę podaj poprawny adres email";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Proszę podaj adres email";
    }

    if (Validator.isEmpty(data.role) || data.role != 'admin' && data.role != 'superadmin') {
        errors.role = "Proszę podaj poprawną rolę osoby";
    }

    if (!Validator.isLength(data.password, {min: 6, max: 32})) {
        errors.password = "Hasło musi zawierać od 6 do 32 znaków";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Proszę podaj hasło";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

containsUppercaseLetter = (str) => {
    for (var i=0; i < str.length; i++) {
        if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
            return true;
        } else if ((i + 1) == str.length) {
            return false;
        }
    }
}