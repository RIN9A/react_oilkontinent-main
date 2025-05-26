const jwt = require("jsonwebtoken");

function getInfoJWT(headers){
    const token = headers?.authorization?.split(' ')[1] // Bearer
    if (token)
        return jwt.verify(token, process.env.SECRET_KEY)
    else
        return false
}
function isAdmin(req){
    const headers = getInfoJWT(req.headers)
    const role = headers?.permissions?.role
    if (role !== 'admin') return false
    return true
}

function isManager(req) {
    const headers = getInfoJWT(req.headers);
    const role = headers?.permissions?.role;
    if(role !== 'manager') return false;
    return true;
}

function isDriver(req) {
    const headers = getInfoJWT(req.headers);
    return headers?.permissions?.role === 'driver';
}


function toDBString(string) {
    if (!string) return 'null'
    return `'${string}'`
}

module.exports = {
    getInfoJWT,
    toDBString,
    isAdmin,
    isManager
}