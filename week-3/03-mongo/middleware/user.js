const { User } = require("../db");
const { AdminValidation } = require("../validations");

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const headers = req.headers;
    const isValid = AdminValidation.safeParse({
        username: headers.username,
        password: headers.password
    })
    if( !isValid.success ) {
        res.status(401).json(isValid.error.format());
        return;
    }
    const user = await User.findOne({username:headers.username, password:headers.password});
    if ( !user ) {
        res.status(401).json({msg:'Incorrect username or password'});
        return;
    }
    next();
}

module.exports = userMiddleware;