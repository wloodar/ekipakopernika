const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');
const { deleteFiles } = require('../../../components/Files/upload');
const ValidateNewPost = require('./ValidateNewPost');
const shortid = require('shortid');

exports.create = async (req, res, next) => {
    const generatedShortId = shortid.generate();

    try {

        const { errors, isValid } = ValidateNewPost(req.body, req.userData);
        if(!isValid) {
            deleteFiles(req.body.processed_files).then(() => {
                return res.status(200).json(errors);
            });
        } else {
            const { category_id, post_content, first_name, last_name, user_class, processed_files } = req.body;

            // if (processed_files !== undefined) {
                await Promise.all(
                    processed_files.map(async (file, i, arr) => {
                        await db.query('INSERT INTO ap_posts_attachments VALUES (default, default, 2, null, null, $1, null, $2, $3, $4)', [ file.new_filename + file.ext, file.ext, file.size, generatedShortId]);
                    })
                );
            // }

            if (req.isAdmin) {
                if (req.userData.role === "superadmin") {
                    await db.query('INSERT INTO ap_posts VALUES (default, default, $1, NOW(), null, null, null, 2, (SELECT id FROM an_users WHERE uuid=$2), NOW(), (SELECT id FROM an_users WHERE uuid=$3), NOW(), $4, $5, null, 1, $6, null, null, $7)', [generatedShortId, req.userData.uuid, req.userData.uuid, req.userData.first_name, req.userData.last_name, category_id, post_content]);    
                } else {
                    await db.query('INSERT INTO ap_posts VALUES (default, default, $1, null, null, null, null, 1, null, null, (SELECT id FROM an_users WHERE uuid=$2), NOW(), $3, $4, null, 1, $5, null, null, $6)', [generatedShortId, req.userData.uuid, req.userData.first_name, req.userData.last_name, category_id, post_content]);    
                }
            } else {
                await db.query('INSERT INTO ap_posts VALUES (default, default, $1, null, null, null, null, 1, null, null, null, NOW(), $2, $3, $4, 1, $5, null, null, $6)', [generatedShortId, first_name, last_name, user_class, category_id, post_content]);  
            }

            return res.status(200).json({ status: 1, post_id: generatedShortId });
        }
    } catch (err) {
        console.log(err);
        
        deleteFiles(req.body.processed_files).then(async () => {
            await db.query('DELETE FROM ap_posts_attachments WHERE post_shortid=$1', [generatedShortId]);
            next(new unexpectedError());
        });
    }
}

exports.fetchFeed = async (req, res, next) => {
    try {
        
        const page = req.query.page;
        const limit = req.userData !== undefined ? req.query.limit >= 500 ? 500 : req.query.limit : req.query.limit >= 15 ? 15 : req.query.limit;
        const startIndex = (page - 1) * limit;
        
        const feed = await db.query(`SELECT DISTINCT ON (ap.approved_at) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.content, ap.created_at, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id WHERE valid_from IS NOT NULL AND valid_until IS NULL ORDER BY ap.approved_at DESC OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`, [startIndex, limit]);
        return res.status(200).json({ status: 1, posts: feed.rows });

    } catch (err) {
        console.log(err);
        
        next(new unexpectedError());
    }
}

exports.fetchExact = async (req, res, next) => {
    try {
        
        const postShortid = req.params.shortid;
        const post = await db.query(`SELECT DISTINCT ON (ap.approved_at) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.content, ap.created_at, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id WHERE ap.shortid = $1 AND valid_from IS NOT NULL AND valid_until IS NULL`, [postShortid]);
        
        if (post.rowCount > 0) {
            return res.status(200).json({ status: 1, post: post.rows[0] });
        } else {
            return res.status(200).json({ status: -1 });
        }
    } catch (err) {        
        console.log(err);
        
        next(new unexpectedError());
    }
}

exports.fetchCategory = async (req, res, next) => {
    try {
        
        const categoryId = req.params.id;
        const page = req.query.page;
        const limit = (req.query.limit > 15 ? 15 : req.query.limit);
        const startIndex = (page - 1) * limit;
        
        const posts = await db.query(`SELECT DISTINCT ON (ap.approved_at) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.content, ap.created_at, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id WHERE ap.category_id = $1 AND valid_from IS NOT NULL AND valid_until IS NULL ORDER BY ap.approved_at DESC OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY`, [categoryId ,startIndex, limit]);
        return res.status(200).json({ status: 1, posts: posts.rows });

    } catch (err) {
        console.log(err);
        
        next(new unexpectedError());
    }
}