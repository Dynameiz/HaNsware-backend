var jwt = require('jsonwebtoken');

auth = (req, res, next) => {
    token = req.headers["authorization"];
    jwt.verify(token, process.env.API_SECRET, (error, decoder) => {
        if(!!error) return res.status(401).send('Forbidden');
        req.user = {
            username: decoded.username,
        };
        next();
    });
};

module.exports = auth;