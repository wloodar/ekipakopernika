const db = require('../../../middleware/db');
const { deleteFiles, deleteImage } = require('../../../components/Files/upload');
const { slugifyUrl } = require('../../../components/Functions/SlugifyUrl');
const { unexpectedError } = require('../../../components/Error/Error');
const ValidateEvent = require('./ValidateEvent');
const shortid = require('shortid');
const moment = require('moment');

exports.createNew = async (req, res, next) => {
    try {
        const { errors, isValid } = ValidateEvent(req.body);
        if(!isValid) {
            deleteFiles(req.body.processed_files).then(() => {
                return res.status(200).json(errors);
            });
        } else {

            const generatedShortId = shortid.generate();
            const { name, place, time, description } = req.body;
            const image = req.body.processed_files[0].new_filename + req.body.processed_files[0].ext;

            await db.query('INSERT INTO ap_events VALUES (default, default, $1, $2, $3, $4, (SELECT id FROM an_users WHERE uuid=$5), NOW(), $6, $7, $8, null)', [name, image, place, description, req.userData.uuid, generatedShortId, slugifyUrl(name + "-" + generatedShortId), time]);
            return res.status(200).json({ status: 1 });
        }

    } catch (err) {
        deleteFiles(req.body.processed_files).then(() => {
            next(new unexpectedError());
        });
    }
}

exports.edit = async (req, res, next) => {
    try {
        const { errors, isValid } = ValidateEvent(req.body);
        if(!isValid) {
            return res.status(200).json(errors);
        } else {

            const previous = await db.query('SELECT * FROM ap_events WHERE shortid=$1', [req.body.shortid]);
            const { time } = previous.rows[0];

            if (time !== req.body.time) {

                await db.query('UPDATE ap_events SET name=$1, place=$2, description=$3, time=$4, old_time=$5 WHERE shortid=$6', [req.body.name, req.body.place, req.body.description, req.body.time, time, req.body.shortid]);
                return res.status(200).json({ status: 1 });
            } else {

                await db.query('UPDATE ap_events SET name=$1, place=$2, description=$3 WHERE shortid=$4', [req.body.name, req.body.place, req.body.description, req.body.shortid]);
                return res.status(200).json({ status: 1 });
            }
        }

    } catch (err) {
        next(new unexpectedError());
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { shortid } = req.body;
        const event = await db.query('SELECT cover_pic FROM ap_events WHERE shortid=$1', [shortid]);

        if (event.rowCount > 0) {
            deleteImage(event.rows[0].cover_pic).then(async () => {
                await db.query('DELETE FROM ap_events WHERE shortid=$1', [shortid]);
                return res.status(200).json({ status: 1 }); 
            });
        } else {
            next(new unexpectedError());
        }
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.fetchAll = async (req, res, next) => {
    try {

        const events = await db.query('SELECT * FROM ap_events WHERE time > $1 ORDER BY time ASC', [moment().startOf('day').unix()]);
        if (events.rows.length > 0) {
            return res.status(200).json({
                events: events.rows
            });
        } else {
            return res.status(200).json({
                events: []
            });
        }

    } catch (err) {
        next(new unexpectedError());
    }
}

exports.fetchExact = async (req, res, next) => {
    try {
        const event = await db.query('SELECT * FROM ap_events WHERE time > $1 AND seo_url=$2', [moment().startOf('day').unix(), req.params.seourl]);
        if (event.rows.length > 0) {
            return res.status(200).json({ status: 1, event: event.rows[0] });
        } else {
            return res.status(200).json({ event: {} });
        }

    } catch (err) {
        next(new unexpectedError());
    }
}