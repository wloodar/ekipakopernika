const isCached = require('./isCached');
const checkAuth = require('./checkAuth');
const isAuthenticated = require('./isAuthenticated');
const isSuperAdmin = require('./Admins/isSuperAdmin');

module.exports = {
    checkAuth,
    isCached,
    isAuthenticated,
    isSuperAdmin
}