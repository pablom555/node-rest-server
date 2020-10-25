const jwt = require('jsonwebtoken');

const verifyToken = ( req, res, next ) => {

    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if ( err ) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: "Token must be provided"
                }
            });
        }

        req.user = decoded.user;

        next();

    })
    
}

const verifyTokenbyURL = (req, res, next) => {

    const token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token must be provided"
                }
            });
        }

        req.user = decoded.user;

        next();

    })

}

const verifyAdminRole = (req, res, next ) => {

    const { role } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {

        return res.status(401).json({
            ok: false,
            err: {
                message: "User dont have permission for this action"
            }
        });
    }

    next();
}

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenbyURL
}