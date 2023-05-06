module.exports = (req, res, next) => {
    if (req.userData.role === "superadmin") {
        next();
    } else {
        return res.status(401).json({
            message: 'Forbidden action.'
        });   
    }
}