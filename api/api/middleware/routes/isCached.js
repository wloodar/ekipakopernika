const redis = require('../../components/Redis/redis');

module.exports = async (req, res, next) => {
    const { cache_id } = req.query;
    try {
        redis.get(cache_id, async function(err, data) {
            if (data !== null && data !== undefined) {
                req.cacheData = JSON.parse(data);
                req.isCached = true;
                next();
            } else {
                req.isCached = false;
                next();
            }   
        });
    } catch (err) {
        console.log(err);
        req.isCached = false;
        next();
    }
}
