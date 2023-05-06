const Validator = require('validator');
const isEmpty = require('../../../components/Validation/isEmpty');

module.exports = function validateNewPost(data, user) {
    let errors = {};

    data.post_content = !isEmpty(data.post_content) ? data.post_content : '';

    if (user === undefined) {
        data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
        data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
        data.user_class = !isEmpty(data.user_class) ? data.user_class : '';

        if (!Validator.isLength(data.first_name, { min: 1, max: 32 })) {
            errors.first_name = "Proszę podaj poprawne imię";
        }
    
        if (Validator.isEmpty(data.first_name)) {
            errors.first_name = "Proszę podaj swoje imię";
        }
    
        if (!Validator.isLength(data.last_name, { min: 1, max: 32 })) {
            errors.last_name = "Proszę podaj poprawne nazwisko";
        }
    
        if (Validator.isEmpty(data.last_name)) {
            errors.last_name = "Proszę podaj swoje nazwisko";
        }

        if (!Validator.isLength(data.user_class, { min: 1, max: 5 })) {
            errors.user_class = "Proszę podaj poprawną klase";
        }
 
        if (Validator.isEmpty(data.user_class)) {
            errors.user_class = "Proszę podaj swoją klase";
        }

        if (!Validator.isLength(data.post_content, { max: 2000 })) {
            errors.post_content = "Post może składać się wyłącznie z 1000 znaków";
        }

    }

    if (Validator.isEmpty(data.post_content)) {
        errors.post_content = "Nic nie napisałeś ;(";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
