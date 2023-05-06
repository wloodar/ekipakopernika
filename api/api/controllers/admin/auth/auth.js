const axios = require('axios');
const db = require('../../../middleware/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
// const async = require('async');
const Validator = require('validator');
const sendMail = require('../../../components/Mail/Mail');
const { unexpectedError } = require('../../../components/Error/Error');

const ValidateLoginData = require('../../../components/Validation/auth/ValidateLogin');


// * Login logic
exports.login = async (req, res, next) => {

    const { errors, isValid } = ValidateLoginData(req.body);
    if(!isValid) {
        return res.status(200).json(errors);
    }
    
    const { login, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM an_users WHERE email=$1 AND status=1', [login]);
        
        if (result.rowCount == 0) {
            return res.status(200).json({ status: 0, general: 'Adres Email lub hasło jest niepoprawne.' });
        } 

        const user = result.rows[0];
        let isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(200).json({ status: 0, general: 'Adres Email lub hasło jest niepoprawne.' });
        } else {
            // * Successful user login
            db.query('INSERT INTO an_users_sessions VALUES (default, $1, default)', [user.id]);
            const token = await generateUserToken(user);
            res.status(200).json({ status: 1, token: `Bearer ${token}` });
        }   
    } catch(err) {
        next(new unexpectedError());
    }
}

// * FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS

const generateUserToken = (user) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({
                uuid: user.uuid,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }, process.env.JWT_SECRET, { expiresIn: 86400 });
            resolve(token);
        } catch (err) {
            reject("Error when signing jwt token.");
        }
    });
}