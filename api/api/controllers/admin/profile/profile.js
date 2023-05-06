const db = require('../../../middleware/db');
const bcrypt = require('bcryptjs');
const { unexpectedError } = require('../../../components/Error/Error');
const ValidateNewPassword = require('./ValidateNewPassword');

exports.changePassword = async (req, res, next) => {
    try {
        const { errors, isValid } = ValidateNewPassword(req.body);
        if(!isValid) {
            return res.status(200).json(errors);
        }

        const { old_password, new_password } = req.body;
        const dbRes = await db.query('SELECT * FROM an_users WHERE uuid=$1', [req.userData.uuid]);
        const user = dbRes.rows[0];

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.status(200).json({ status: 0, old_password: 'Podane hasło jest niepoprawne' });
        } else {
            // * Success
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(new_password, salt);

            await db.query('UPDATE an_users SET password=$1 WHERE uuid=$2', [hash, req.userData.uuid]);

            return res.status(200).json({ status: 1 });
        }   

    } catch (err) {        
        next(new unexpectedError());
    }
}