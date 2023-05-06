const Validator = require('validator');
const isEmpty = require('../../../components/Validation/isEmpty');

module.exports = function validateCreation(data) {
    let errors = {};

    data.old_password = !isEmpty(data.old_password) ? data.old_password : '';
    data.new_password = !isEmpty(data.new_password) ? data.new_password : '';
    data.new_password_confirm = !isEmpty(data.new_password_confirm) ? data.new_password_confirm : '';

    if (Validator.isEmpty(data.old_password)) {
        errors.old_password = "Proszę podaj swoje aktualne hasło";
    }

    if (!Validator.isLength(data.new_password, {min: 6, max: 32})) {
        errors.new_password = "Hasło musi zawierać od 6 do 32 znaków";
    }

    if (Validator.isEmpty(data.new_password)) {
        errors.new_password = "Proszę podaj nowe hasło";
    }

    if (data.new_password !== data.new_password_confirm) {
        errors.new_password_confirm = "Powtórzone hasło nie jest identyczne do nowego";
    }

    if (!Validator.isLength(data.new_password_confirm, {min: 6, max: 32})) {
        errors.new_password_confirm = "Powtórzone hasło jest niepoprawne";
    }

    if (Validator.isEmpty(data.new_password_confirm)) {
        errors.new_password_confirm = "Proszę powtórz nowe hasło";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
