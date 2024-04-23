const { Admin } = require("../db");
const { AdminValidation } = require("../validations");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const headers = req.headers;
    const isValid = AdminValidation.safeParse({
        username: headers.username,
        password: headers.password
    })
    if( !isValid.success ) {
        res.status(401).json(isValid.error.format());
        return;
    }
    const User = await Admin.findOne({username:headers.username, password:headers.password});
    if ( !User ) {
        res.status(401).json({msg:'Incorrect username or password'});
        return;
    }
    next();
}

module.exports = adminMiddleware;