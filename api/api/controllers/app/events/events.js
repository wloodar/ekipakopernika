const moment = require('moment');
const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');

exports.fetchAll = async (req, res, next) => {
    try {
        const events = await db.query('SELECT * FROM ap_events WHERE time > $1 ORDER BY time ASC', [moment().startOf('day').unix()]);
        if (events.rows.length > 0) {
            return res.status(200).json({ status: 1, events: events.rows });
        } else {
            return res.status(200).json({ events: [] });
        }
    } catch (err) {
        next(new unexpectedError());
    }
}