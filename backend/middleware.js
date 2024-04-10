const JWT_SECRET = require("../config,js");
const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Unauthorized Request"
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        if (decode.userID) {
            req.userID = decode.userID;
            next();
        } else return res.status(403).json({ message: "Invalid Token" })
    } catch (error) {
        return res.status(403).json({
            message: "Invalid Token"
        })
    }

}

module.exports = { authMiddleware };