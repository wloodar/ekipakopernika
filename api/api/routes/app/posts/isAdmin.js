const jwt = require('jsonwebtoken');
const uuidBase62 = require('uuid-base62');
const redis = require('../../../components/Redis/redis');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.isAdmin = true;
        req.userData = decoded;

        redis.get(`AnIsBlocked_${uuidBase62.encode(decoded.uuid)}`, async (err, data) => {
            if (err) next(new unexpectedError());
            else {
                if (data == null) {
                    const blockQuery = await db.query('SELECT blocked FROM an_users WHERE uuid=$1', [decoded.uuid]);
                    const isBlocked = blockQuery.rows[0]['blocked'];
                    
                    redis.setex(`AnIsBlocked_${uuidBase62.encode(decoded.uuid)}`, 7200, isBlocked);
                    if (isBlocked) return res.status(200).json({ status: -1, message: "Twoje konto zostało zablokowane." });
                    else {
                        next();    
                    }
                } else {   
                    if (data !== "false") return res.status(200).json({ status: -1, message: "Twoje konto zostało zablokowane." });
                    else {
                        next();    
                    }
                }
            }
        });
    } catch (error) {
        req.isAdmin = false;
        next();
    }
}