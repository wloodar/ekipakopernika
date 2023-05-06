const db = require('../../../middleware/db');
const bcrypt = require('bcryptjs');
const redis = require('../../../components/Redis/redis');
const uuidBase62 = require('uuid-base62');
const { unexpectedError } = require('../../../components/Error/Error');
const ValidateAdminCreate = require('./ValidateAdminCreate');

exports.createUser = async (req, res, next) => {

    const { errors, isValid } = ValidateAdminCreate(req.body);
    if (!isValid) {
        return res.status(200).json(errors);
    }

    const { first_name, last_name, email, role, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM an_users WHERE email=$1 AND status=1', [email]);
        const user = result.rows[0];

        if (result.rowCount != 0) {
            let parametersExist = {};

            if (user.email == email) {
                parametersExist.email = "Osoba z takim adresem Email jest już zarejestrowana"
            }

            return res.status(200).json(parametersExist);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            
            await db.query('INSERT INTO an_users VALUES (default, default, $1, $2, $3, $4, null, $5, null, null, false, null, default, default, (SELECT id FROM an_users WHERE uuid=$6), default)', [email, first_name, last_name, role, hash, req.userData.uuid]);

            return res.status(200).json({ status: 1 });
        }
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.blockUser = async (req, res, next) => {
    try {
        const userUuid = req.params.uuid;
        const blockStatus = parseInt(req.params.status);

        if (blockStatus === 0) {
            await db.query('UPDATE an_users SET blocked=false WHERE uuid=$1', [userUuid]);
            redis.setex(`AnIsBlocked_${uuidBase62.encode(userUuid)}`, 7200, false);
        } else {
            await db.query('UPDATE an_users SET blocked=true WHERE uuid=$1', [userUuid]);
            redis.setex(`AnIsBlocked_${uuidBase62.encode(userUuid)}`, 7200, true);
        }

        return res.status(200).json({ status: 1 });
    } catch (err) {
        next(new unexpectedError());
    }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        const userUuid = req.params.uuid;

        await db.query('UPDATE an_users SET status=-1 WHERE uuid=$1', [userUuid]);
        return res.status(200).json({ status: 1 });
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const users = await (await db.query('SELECT * FROM an_users WHERE status=1')).rows;
        return res.status(200).json(users);        
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.getSpecificUser = async (req, res, next) => {
    try { 

        // const user = await (await db.query(`SELECT DISTINCT ON (users.id) users.*, array_agg(row_to_json(userssessions.*)) OVER (PARTITION BY users.id) as sessions FROM (SELECT * FROM an_users_activeness WHERE user_id=(SELECT id FROM an_users WHERE uuid=$1) ORDER BY id DESC LIMIT 3) userssessions LEFT JOIN an_users users ON users.uuid=$1`, [req.params.id]));
        const user = await db.query('SELECT * FROM an_users WHERE uuid=$1 AND status=1', [req.params.id]);        
        if (user.rowCount > 0) {
            const sessions = await db.query('SELECT * FROM an_users_activeness WHERE user_id=(SELECT id FROM an_users WHERE uuid=$1) ORDER BY id DESC LIMIT 5', [req.params.id]);

            if (sessions.rowCount > 0) {
                user.rows[0].sessions = sessions.rows;
                return res.status(200).json(user.rows[0]); 
            } else {                
                user.rows[0].sessions = null;
                return res.status(200).json(user.rows[0]);
            }
              
        } else {
            return res.status(200).json({ status: 0, message: "Nie znaleziono osoby z takim id" }); 
        }
    } catch (err) {
        console.log(err);
        
        next(new unexpectedError());
    }
}