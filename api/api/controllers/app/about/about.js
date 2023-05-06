const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');

exports.getAll = async (req, res, next) => {
    try {
        const people = await db.query('SELECT * FROM ap_about_people ORDER BY name ASC');
        if (people.rowCount > 0) {
            return res.status(200).json({ status: 1, people: people.rows });
        }
    } catch (err) {
        next(new unexpectedError());
    }
}