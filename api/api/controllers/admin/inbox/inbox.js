const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');

exports.inboxMessages = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const messages = await db.query('SELECT an_inbox_messages.*, an_users.uuid as sent_by_uuid, an_users.role as sent_by_role, an_users.first_name, an_users.last_name FROM an_inbox_messages INNER JOIN an_users ON an_users.id = an_inbox_messages.sent_by ORDER BY an_inbox_messages.id ASC OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY', [startIndex, limit]);

        if (messages.rowCount > 0) {
            return res.status(200).json({ messages: messages.rows });
        } else {
            return res.status(200).json({ pagination: false });
        }
    } catch (err) {
        next(new unexpectedError());
    }
}