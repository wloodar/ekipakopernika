const db = require('../../../middleware/db');
const redis = require('../../../components/Redis/redis');
const ValidateCreation = require('./ValidateCreation');
const { unexpectedError } = require('../../../components/Error/Error');
const { deleteFiles } = require('../../../components/Files/upload');
const { slugifyUrl } = require('../../../components/Functions/SlugifyUrl');
const Validator = require('validator');

const parseArgs = require('minimist');

exports.categoriesAll = async (req, res, next) => {
    try {
        redis.get('Categories_All', async function(err, reply) {
            if (reply !== null) {
                return res.status(200).json({
                    categories: JSON.parse(reply),
                    args: parseArgs(process.argv.slice(2))
                });
            } else {
                const categories = await db.query('SELECT * FROM ap_categories WHERE status!=$1 ORDER BY id DESC', ["-1"]);
                if (categories.rows.length > 0) {
                    redis.set("Categories_All", JSON.stringify(categories.rows));
                    return res.status(200).json({
                        categories: categories.rows
                    });
                }     
            }   
        });
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.categoriesNew = async (req, res, next) => {
    try {
        const { errors, isValid } = ValidateCreation(req.body);
        if(!isValid) {
            deleteFiles(req.body.processed_files).then(() => {
                return res.status(200).json(errors);
            });
        } else {
            redis.get('Categories_All', function(err, reply) {
                if (reply !== null) {
                    redis.DEL("Categories_All");
                }
            });
    
            const { status, create_name, create_description, processed_files } = req.body;
            const coverImage = processed_files[0].new_filename + processed_files[0].ext;
    
            await db.query('INSERT INTO ap_categories VALUES (default, default, null, null, $1, (SELECT id FROM an_users WHERE uuid=$2), now(), $3, $4, null, $5)', [status, req.userData.uuid, create_name, coverImage, slugifyUrl(create_name)]);
            return res.status(200).json({ status: 1 });
        }

    } catch (err) {
        deleteFiles(req.body.processed_files).then(() => {
            next(new unexpectedError());
        });
    }
}

exports.modifyCategory = async (req, res, next) => {
    try {

        redis.get('Categories_All', (err, reply) => {
            if (reply !== null) {
                redis.DEL("Categories_All");
            }
        });

        const { modify_type } = req.body;
        if (modify_type === "status") {
            const { category_uuid, status } = req.body;

            await db.query('UPDATE ap_categories SET status = $1 WHERE uuid=$2', [status, category_uuid]);
            return res.status(200).json({ status: 1});
        } else if (modify_type === "name") {

            const { category_uuid, name } = req.body;

            if (Validator.isEmpty(name)) {
                res.status(200).json({ status: 0, messsage: "Podaj poprawną nazwę kategorii" });
            } else if (!Validator.isLength(name, { min: 1, max: 64 })) {
                res.status(200).json({ status: 0, messsage: "Proszę podaj poprawną nazwę kategorii (od 1 do 64 znaków)" });
            } else {

                await db.query('UPDATE ap_categories SET name = $1, seo_url=$2 WHERE uuid=$3', [name, slugifyUrl(name), category_uuid]);
                return res.status(200).json({ status: 1});
            }

        } else {
            next(new unexpectedError());
        }
    } catch (err) {
        next(new unexpectedError());
    }
}