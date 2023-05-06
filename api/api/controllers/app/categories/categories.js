const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');

exports.getAll = async (req, res, next) => {
    try {
        if (req.isCached) {
            return res.status(200).json({ status: 1, categories: req.cacheData });
        } else {
            const categories = await db.query('SELECT * FROM ap_categories WHERE status=1');
            return res.status(200).json({ status: 1, categories: categories.rows });
        }
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.feed = async (req, res, next) => {
    try {

        // const categories = await db.query('SELECT apcat.id, apcat.name, apcat.cover_pic, COUNT(posts.*) OVER (PARTITION BY apcat.id) as total_posts FROM ap_categories apcat LEFT JOIN ap_posts posts ON posts.category_id=apcat.id AND posts.valid_from IS NOT NULL AND posts.valid_until IS NULL WHERE apcat.status=1 ORDER BY random() LIMIT 5');
        const categories = await db.query('SELECT DISTINCT ON (apcat.id) apcat.id, apcat.name, apcat.cover_pic, apcat.seo_url, COUNT(posts.*) OVER (PARTITION BY apcat.id) as total_posts FROM ap_categories apcat LEFT JOIN ap_posts posts ON posts.category_id=apcat.id AND posts.valid_from IS NOT NULL AND posts.valid_until IS NULL WHERE apcat.status=1');
        return res.status(200).json({ status: 1, categories: categories.rows });
    } catch (err) {
        console.log(err);
        next(new unexpectedError());
    }
}

exports.getExact = async (req, res, next) => {
    try {
        if (req.params.url === undefined) { next(new unexpectedError()) }
        else {
            const categoryUrl = req.params.url;

            const category = await db.query('SELECT DISTINCT ON (apcat.id) apcat.id, apcat.name, apcat.cover_pic as image, COUNT(posts.*) OVER (PARTITION BY apcat.id) as total_posts FROM ap_categories apcat LEFT JOIN ap_posts posts ON posts.category_id = apcat.id AND posts.valid_from IS NOT NULL AND posts.valid_until IS NULL WHERE seo_url=$1 AND apcat.status!=$2', [categoryUrl, "-1"]);
            if (category.rowCount > 0) {
                return res.status(200).json({ status: 1, category: category.rows[0] });
            } else {
                return res.status(200).json({ status: 1, category: null });
            }
        }
    } catch (err) {
        next(new unexpectedError());
    }
}