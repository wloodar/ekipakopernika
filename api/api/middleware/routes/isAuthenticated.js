const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(401).json({ status: 0, message: 'Forbidden action.' });
    } catch (error) {
        next();
    }
}