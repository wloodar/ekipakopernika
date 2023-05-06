const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');
const { deleteImage } = require('../../../components/Files/upload');

exports.createNewPerson = async (req, res, next) => {
    try {
        const { create_name, create_description, processed_files } = req.body;
        const image = processed_files[0].new_filename + processed_files[0].ext;

        await db.query('INSERT INTO ap_about_people VALUES (default, default, $1, $2, $3, (SELECT id FROM an_users WHERE uuid=$4), default)', [create_name, create_description, image, req.userData.uuid]);
        return res.status(200).json({ status: 1 });
    } catch (err) {
        deleteFiles(req.body.processed_files).then(() => {
            next(new unexpectedError());
        });
    }
}

exports.deletePerson = (req, res, next) => {
    try {
        const { id, image } = req.body;

        deleteImage(image).then(async () => {
            await db.query('DELETE FROM ap_about_people WHERE id=$1', [id]);
            return res.status(200).json({ status: 1 }); 
        });
    } catch (err) {        
        next(new unexpectedError());
    }
}