const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateNewPassword(data) {
    
    let errors = {};
    data.new_password = !isEmpty(data.new_password) ? data.new_password : '';
    data.repeated_password = !isEmpty(data.repeated_password) ? data.repeated_password : '';

    if (!containsUppercaseLetter(data.new_password)) {
        errors.new_password = 'Password should contain at least one capital letter'
    }

    if(!Validator.isLength(data.new_password, {min: 6, max: 32})) {
        errors.new_password = 'Pasword should contain from 6 to 32 characters';
    }

    if(Validator.isEmpty(data.new_password)) {
        errors.new_password = 'Please enter your new password';
    }

    if (data.new_password !== data.repeated_password) {
        errors.repeated_password = 'Confirmed password not match';
    }

    if(Validator.isEmpty(data.repeated_password)) {
        errors.repeated_password = 'Please confirm new password';
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