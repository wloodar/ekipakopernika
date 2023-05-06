const db = require('../../../middleware/db');
const { unexpectedError } = require('../../../components/Error/Error');
const { deletePostFiles } = require('../../../components/Files/upload');

exports.getAll = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.userData !== undefined ? req.query.limit >= 500 ? 500 : req.query.limit : req.query.limit >= 15 ? 15 : req.query.limit;
        const startIndex = (page - 1) * limit;

        const posts = await db.query(`SELECT DISTINCT ON (ap.id) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.class, ap.content, ap.created_at, ap.valid_from, ap.valid_until, row_to_json(an_users.*) as admin, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id LEFT JOIN an_users ON an_users.id=ap.created_by WHERE (valid_from IS NOT NULL AND valid_until IS NULL) OR (valid_from IS NULL AND valid_until IS NULL AND ap.updated_by IS NULL) ORDER BY ap.id DESC OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`, [startIndex, limit]);
        return res.status(200).json({ status: 1, posts: posts.rows });
    } catch (err) {        
        next(new unexpectedError());
    }
}

exports.userWaitingToApprove = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.userData !== undefined ? req.query.limit >= 500 ? 500 : req.query.limit : req.query.limit >= 15 ? 15 : req.query.limit;
        const startIndex = (page - 1) * limit;
        
        if (req.userData.role === "admin") {
            const posts = await db.query(`SELECT DISTINCT ON (ap.id) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.class, ap.content, ap.created_at, ap.valid_from, ap.valid_until, row_to_json(an_users.*) as admin, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id LEFT JOIN an_users ON an_users.id=ap.created_by WHERE ap.created_by=(SELECT id FROM an_users WHERE uuid=$3) AND ap.valid_from IS NULL AND ap.valid_until IS NULL ORDER BY ap.id DESC OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`, [startIndex, limit, req.userData.uuid]);
            if (posts.rowCount > 0) {
                return res.status(200).json({ status: 1, posts: posts.rows });
            } else {
                return res.status(200).json({ status: 1, posts: [] });
            }
        } else {
            const posts = await db.query(`SELECT DISTINCT ON (ap.id) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.class, ap.content, ap.created_at, ap.valid_from, ap.valid_until, row_to_json(an_users.*) as admin, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id LEFT JOIN an_users ON an_users.id=ap.created_by WHERE valid_from IS NULL AND valid_until IS NULL AND ap.updated_by IS NULL ORDER BY ap.id DESC OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`, [startIndex, limit]);
            if (posts.rowCount > 0) {
                return res.status(200).json({ status: 1, posts: posts.rows });
            } else {
                return res.status(200).json({ status: 1, posts: [] });
            }
        }
    } catch (err) {
        console.log(err);
        
        next(new unexpectedError());
    }
}

exports.getExactPost = async (req, res, next) => {
    try {
        const post = await db.query(`SELECT DISTINCT ON (ap.id) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.class, ap.content, ap.created_at, ap.valid_from, ap.valid_until, row_to_json(an_users.*) as admin, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id LEFT JOIN an_users ON an_users.id=ap.created_by WHERE ap.shortid=$1 AND (valid_from IS NOT NULL AND valid_until IS NULL) OR (ap.shortid=$1 AND valid_from IS NULL AND valid_until IS NULL AND ap.updated_by IS NULL)`, [req.params.shortid]);
        if (post.rowCount > 0) {
            return res.status(200).json({ status: 1, post: post.rows[0] });
        } else {
            next(new unexpectedError())
        }
    } catch (err) {
        next(new unexpectedError())
    }
}

exports.newAcceptPost = async (req, res, next) => {
    try {
        const { shortid } = req.body;

        await db.query('UPDATE ap_posts SET valid_from=NOW(), status=2, approved_by=(SELECT id FROM an_users WHERE uuid=$1), approved_at=NOW() WHERE shortid=$2', [req.userData.uuid ,shortid]);
        return res.status(200).json({ status: 1 });
    } catch (err) {
        next(new unexpectedError());
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const { shortid } = req.body;

        const post = await db.query(`SELECT DISTINCT ON (ap.id) ap.id as post_id, ap.shortid, ap.type as post_type, ap.first_name, ap.last_name, ap.class, ap.content, ap.created_at, ap.valid_from, ap.valid_until, row_to_json(an_users.*) as admin, json_build_object('id', apcat.id, 'name', apcat.name, 'image', apcat.cover_pic, 'seo_url', apcat.seo_url) as category, array_agg(row_to_json(apattach.*)) OVER (PARTITION BY ap.shortid) as attachments FROM ap_posts ap LEFT JOIN ap_posts_attachments apattach ON apattach.post_shortid = ap.shortid LEFT JOIN ap_categories apcat ON apcat.id = ap.category_id LEFT JOIN an_users ON an_users.id=ap.created_by WHERE ap.shortid=$1 AND (valid_from IS NOT NULL AND valid_until IS NULL) OR (ap.shortid=$1 AND valid_from IS NULL AND valid_until IS NULL AND ap.updated_by IS NULL)`, [shortid]);
        
        deletePostFiles(post.rows[0].attachments).then(async () => {
            await db.query('DELETE FROM ap_posts_attachments WHERE post_shortid=$1', [shortid]);
            await db.query('DELETE FROM ap_posts WHERE shortid=$1', [shortid]);

            return res.status(200).json({ status: 1 });
        });
    } catch (err) {
        next(new unexpectedError());
    }
}